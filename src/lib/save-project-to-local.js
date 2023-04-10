import storage from './storage';

const generateId = () => {
    let randomPart = Math.random().toString(36).substring(2, 15);
    let timestampPart = Date.now().toString(36);
    return randomPart + timestampPart;
}

const newProject = (name) => {
    name = name || "New Project";
    let id = generateId();
    let time = Date.now();
    return {
        id: id,
        description: {
            id: id,
            name: name,
            createDate: time,
            updateDate: time,
        }
    }
}


/**
 * Save a project JSON to the project server.
 * This should eventually live in scratch-www.
 * @param {number} id the ID of the project, null if a new project.
 * @param {object} data the JSON project representation.
 * @param {object} params the request params.
 * @property {?number} params.originalId the original project ID if a copy/remix.
 * @property {?boolean} params.isNew a flag indicating if this save is creating a new.
 * @property {?boolean} params.isCopy a flag indicating if this save is creating a copy.
 * @property {?boolean} params.isRemix a flag indicating if this save is creating a remix.
 * @property {?string} params.title the title of the project.
 * @return {Promise} A promise that resolves when the network request resolves.
 */

const saveProject = (id, data, options) => {
    let projectList = JSON.parse(localStorage.getItem('project-list') || "{}");
    let currentID = JSON.parse( sessionStorage.getItem("currentID"));
    let name = options.title + ".sb3";
    let description;
    ( {id, description} = newProject(options.title) );

    return Promise.resolve().then(() => {
        if (options) {
            if (options.isNew || options.isCopy || options.isRemix) {
                if(currentID){
                    // 修改项目
                    console.log("修改项目");
                    return getProjectList().then((projectNameList) => {
                        projectList[currentID.id].name = options.title;
                        projectList[currentID.id].updateDate = Date.now();
                        localStorage.setItem("project-list", JSON.stringify(projectList));
                        deleteFile(currentID.name);
                        moveFile(name);
                    })
                }else{
                    // 创建项目
                    console.log("创建项目");
                    return getProjectList().then((projectNameList) => {
                        if (options.isNew) {
                            if (projectNameList.indexOf(options.title) !== -1) {
                                console.log("名称重复！");
                                moveFile(name);
                                return Promise.reject("name conflict");
                            } else {
                                projectList[id] = description;
                                localStorage.setItem("project-list", JSON.stringify(projectList));
                                // 把 .TEMP 目录下的文件移到 MyProject 目录中
                                return moveFile(name);
                            }
                        }
                        
                        // if(options.isCopy){
                        //     //  匹配括号中的数字
                        //     let numMatch = options.title.match(/\((\d+)\)/);
                        //     if (numMatch) {
                        //         // 如果已经包含数字，则将数字自增1
                        //         let num = Number(numMatch[1]) + 1;
                        //         options.title = options.title.replace(/\(\d+\)/, '(' + num + ')');
                        //     } else {
                        //         // 如果没有数字，则在末尾添加"(1)"
                        //         options.title = options.title + '(1)';
                        //     }
                        // }
                        // ( {id, description} = newProject(options.title) );
                        // return storage.store(storage.AssetType.Project, storage.DataFormat.JSON, data, id)
                    });

                }
            } 
           
        }
    }).then(() => deleteDirectory())
    .then(()=>({id: id}));
}


/**
 * 用来获取 MyProject 目录下所有文件名称
 * @return {Array}
 */
function getProjectList() {
    return new Promise((resolve, reject) => {
        let url = cordova.file.externalDataDirectory;
        if(cordova.platformId == "ios"){
            url = cordova.file.documentsDirectory;
        }
        window.resolveLocalFileSystemURL(url + "MyProject", function (dirEntry) {
            // use dirEntry.createReader to get directory reader
            var dirReader = dirEntry.createReader();
            // use dirReader.readEntries to get FileList
            dirReader.readEntries(function (files) {
                // loop through files
                var projectList = [];
                for (var i = 0; i < files.length; i++) {
                    // get each file entry
                    projectList.push(files[i].name.replace(".sb3", ""));
                }
                resolve(projectList);
            }, function (err) {
                reject(err);
            });
        }, function (err) {
            reject(err);
        });
    });
}

/**
 * 用来移动文件
 * @param {string} projectName  需要移动的文件名称
 */
function moveFile(projectName) {
    return new Promise((resolve, reject) => {
        let url = cordova.file.externalDataDirectory;
        if(cordova.platformId == "ios"){
            url = cordova.file.documentsDirectory;
        }
        // 获取外部存储目录的路径
        var externalDataDirectory = url;
        // 定义目标目录的路径
        var targetDirectory = "MyProject";
        // 获取文件对象
        window.resolveLocalFileSystemURL(externalDataDirectory + ".TEMP/" + projectName, function (fileEntry) {
            // 获取目标目录的目录对象
            window.resolveLocalFileSystemURL(externalDataDirectory + targetDirectory, function (dirEntry) {
                // 移动文件到目标目录
                fileEntry.moveTo(dirEntry, projectName, function (newFileEntry) {
                    console.log("文件移动成功：" + newFileEntry.fullPath);
                    resolve();
                }, function (error) {
                    console.log("文件移动失败：" + error.code);
                    reject();
                });
            }, function (error) {
                console.log("获取目标目录失败：" + error.code);
                reject();
            });
        }, function (error) {
            console.log("获取文件失败：" + error.code);
            reject();
        });
    })
}


/**
 * 用来删除 .TEMP 目录及其所有内容
 */
function deleteDirectory() {
    return new Promise((resolve, reject) => {
        let url = cordova.file.externalDataDirectory;
        if(cordova.platformId == "ios"){
            url = cordova.file.documentsDirectory;
        }
        window.resolveLocalFileSystemURL(url, function (dirEntry) {
            dirEntry.getDirectory(".TEMP", { create: false }, function (subDirEntry) {
                subDirEntry.removeRecursively(function () {
                    console.log("TEMP目录成功删除!");
                    resolve();
                }, function (error) {
                    console.log("删除TEMP目录错误: " + error.code);
                    reject();
                });
            }, function (error) {
                console.log("获取TEMP目录错误: " + error.code);
                reject();
            });
        }, function (error) {
            console.log("获取外部数据目录错误: " + error.code);
            reject();
        });
    })
}

/**
 * 用来重命名文件
 * @param {string} oldName  旧文件名称
 * @param {string} newName  新文件名称
 */
function modifyFileName(oldName, newName) {
    var url = cordova.file.externalDataDirectory + ".TEMP/" + oldName
    window.resolveLocalFileSystemURL(url, function (fileEntry) {
        fileEntry.moveTo(fileEntry.parent, newName, function () {
            console.log("文件重命名成功!");
        }, function (error) {
            console.log("重命名文件出错: " + error.code);
        });
    }, function (error) {
        console.log("获取文件时出错: " + error.code);
    });

}


/**
 * 用来删除 myporject 目录下指定文件
 * @param {string} filePath 要删除的文件名称
 */
function deleteFile(filePath) {
    return new Promise((resolve, reject) => {
        let url = cordova.file.externalDataDirectory;
        if(cordova.platformId == "ios"){
            url = cordova.file.documentsDirectory;
        }
        window.resolveLocalFileSystemURL(url, function (dirEntry) {
            // 获取要删除的文件的路径
            filePath = "myproject/" + filePath;
            // 删除文件
            dirEntry.getFile(filePath, { create: false }, function (fileEntry) {
                fileEntry.remove(function () {
                    console.log("文件删除成功");
                    resolve();
                }, function () {
                    console.log("文件删除失败");
                    reject();
                });
            }, function () {
                console.log("文件不存在");
                reject();
            });

        }, function () {
            console.log("获取文件系统失败");
            reject();
        });
    })
}

export default saveProject;