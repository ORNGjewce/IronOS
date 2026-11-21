package com.ironos.fitness;

import androidx.activity.result.ActivityResult;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.provider.DocumentsContract;
import android.content.ContentResolver;
import android.database.Cursor;
import android.provider.OpenableColumns;
import android.util.Base64;
import com.getcapacitor.*;
import com.getcapacitor.annotation.*;
import java.io.*;
import java.security.MessageDigest;

@CapacitorPlugin(name = "ProfileArchive")
public class ProfileArchivePlugin extends Plugin {
    private static final String PREFS = "iron_profile_archive";
    private static final String KEY = "folder";
    private static final String FINAL = "IRON-OS-Automatic-Profile.json";
    private Uri folder() {
        String s = getContext().getSharedPreferences(PREFS,0).getString(KEY,null);
        return s == null ? null : Uri.parse(s);
    }
    @PluginMethod
    public void folderStatus(PluginCall call) {
        JSObject result = new JSObject();
        result.put("selected",folder()!=null);
        call.resolve(result);
    }
    @PluginMethod
    public void chooseFolder(PluginCall call) {
        Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT_TREE);
        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION | Intent.FLAG_GRANT_WRITE_URI_PERMISSION | Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
        startActivityForResult(call,intent,"folderSelected");
    }
    @ActivityCallback
    private void folderSelected(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (result.getResultCode()!=Activity.RESULT_OK || result.getData()==null || result.getData().getData()==null) {call.reject("Folder selection canceled");return;}
        Uri uri = result.getData().getData();
        try {
            getContext().getContentResolver().takePersistableUriPermission(uri,Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_WRITE_URI_PERMISSION);
            getContext().getSharedPreferences(PREFS,0).edit().putString(KEY,uri.toString()).apply();
            call.resolve();
        } catch(Exception e) {call.reject("Cannot retain access to selected folder",e);}
    }
    private Uri find(Uri tree, String name) {
        ContentResolver resolver = getContext().getContentResolver();
        Uri children = DocumentsContract.buildChildDocumentsUriUsingTree(tree,DocumentsContract.getTreeDocumentId(tree));
        try(Cursor c=resolver.query(children,new String[]{DocumentsContract.Document.COLUMN_DOCUMENT_ID,DocumentsContract.Document.COLUMN_DISPLAY_NAME},null,null,null)) {
            if(c!=null)while(c.moveToNext())if(name.equals(c.getString(1)))return DocumentsContract.buildDocumentUriUsingTree(tree,c.getString(0));
        }
        return null;
    }
    private String sha(byte[] bytes) throws Exception {
        byte[] digest=MessageDigest.getInstance("SHA-256").digest(bytes);
        StringBuilder b=new StringBuilder();for(byte x:digest)b.append(String.format(java.util.Locale.US,"%02x",x&255));return b.toString();
    }
    @PluginMethod
    public void writeVerified(PluginCall call) {
        Uri tree=folder();if(tree==null){call.reject("Choose a backup folder first");return;}
        String encoded=call.getString("base64");if(encoded==null){call.reject("Missing archive data");return;}
        try {
            byte[] bytes=Base64.decode(encoded,Base64.DEFAULT);
            if(bytes.length==0 || bytes.length>200*1024*1024)throw new Exception("Archive exceeds size limit or is empty");
            ContentResolver resolver=getContext().getContentResolver();
            String tempName="IRON-OS-Pending-"+System.currentTimeMillis()+".json";
            Uri temp=DocumentsContract.createDocument(resolver,DocumentsContract.buildDocumentUriUsingTree(tree,DocumentsContract.getTreeDocumentId(tree)),"application/json",tempName);
            if(temp==null)throw new Exception("Cannot create backup file");
            try {
                try(OutputStream stream=resolver.openOutputStream(temp,"wt")){if(stream==null)throw new IOException("Cannot write archive");stream.write(bytes);stream.flush();}
                ByteArrayOutputStream readback=new ByteArrayOutputStream();
                try(InputStream stream=resolver.openInputStream(temp)){if(stream==null)throw new IOException("Cannot read archive");byte[] buf=new byte[8192];int n;while((n=stream.read(buf))!=-1)readback.write(buf,0,n);}
                if(!sha(bytes).equals(sha(readback.toByteArray())))throw new Exception("Backup verification failed");
                Uri previous=find(tree,FINAL);
                // Preserve old archive until the replacement has been written and verified.
                if(previous!=null && !DocumentsContract.deleteDocument(resolver,previous))throw new Exception("Could not replace old backup; verified pending file retained");
                Uri renamed=DocumentsContract.renameDocument(resolver,temp,FINAL);
                if(renamed==null)throw new Exception("Backup verified but rename failed; pending file retained");
                JSObject result=new JSObject();result.put("bytes",bytes.length);result.put("sha256",sha(bytes));call.resolve(result);
            } catch(Exception e) {throw e;}
        } catch(Exception e) {call.reject("Backup was not completed: "+e.getMessage(),e);}
    }
}
