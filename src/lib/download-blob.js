export default (filename, blob) => {
    const downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);

    // Use special ms version if available to get it working on Edge.
    if (navigator.msSaveOrOpenBlob) {
        navigator.msSaveOrOpenBlob(blob, filename);
        return;
    }
    
    if (window.cordova && (window.cordova.platformId === 'ios' || window.cordova.platformId === 'android')){
        writeDirectory();
        saveAs(blob,filename);
        let path = `${cordova.file.dataDirectory}/newFile/project/${filename}`
        window.plugins.socialsharing.share(null, null, path);
    }

    if ('download' in HTMLAnchorElement.prototype) {
        const url = window.URL.createObjectURL(blob);
        downloadLink.href = url;
        downloadLink.download = filename;
        downloadLink.type = blob.type;
        downloadLink.click();
        // remove the link after a timeout to prevent a crash on iOS 13 Safari
        window.setTimeout(() => {
            document.body.removeChild(downloadLink);
            window.URL.revokeObjectURL(url);
        }, 1000);
    } else {
        // iOS 12 Safari, open a new page and set href to data-uri
        let popup = window.open('', '_blank');
        const reader = new FileReader();
        reader.onloadend = function () {
            popup.location.href = reader.result;
            popup = null;
        };
        reader.readAsDataURL(blob);
    }
    function writeDirectory () {
        var dirUri = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(dirUri, function (entry) {
          entry.getDirectory("newFile", {
            create: true,
          }, function (dirEntry) {
            dirEntry.getDirectory('project', { create: true }, function (subDirEntry) {
              // createFile(subDirEntry, "fileInNewSubDir.txt");
            }, ()=>console.log("文件夹创建失败！"));
          }, ()=>console.log("文件夹创建失败！"))
        }, (e)=>console.log(e.toString()))
    }
      // 写入数据
    function saveAs (content, fileName) { 
        var dirUri = cordova.file.dataDirectory;
        window.resolveLocalFileSystemURL(dirUri, function (Entry) {
          Entry.getDirectory("newFile", {
            create: true,
          }, function (dirEntry) {
            dirEntry.getDirectory('project', { create: true }, function (subDirEntry) {
              saveFile(subDirEntry, content, fileName);
            }, ()=>console.log("文件夹创建失败！"));
      
          }, ()=>console.log("文件夹创建失败！"))
        })
        console.log(cordova.file.dataDirectory);
    }
    function saveFile (dirEntry, fileData, fileName) {
        dirEntry.getFile(
          fileName, {
          create: true,
          exclusive: false
        },
          function (fileEntry) {
            writeFile(fileEntry, fileData);
          }, (e)=>console.log('Failed create file: ' + e.toString()));
    }

    function writeFile (fileEntry, dataObj) {
        fileEntry.createWriter(function (fileWriter) {
          fileWriter.onwriteend = function () {
      
          };
          fileWriter.onerror = function (e) {
            console.log('Failed file write: ' + e.toString());
          };
          fileWriter.write(dataObj);
      
        });
    }
};
