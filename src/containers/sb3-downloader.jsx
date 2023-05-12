import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
import downloadBlob from '../lib/download-blob';
/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3Downloader>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3Downloader>
 */
class SB3Downloader extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject',
			'saveProjectToFile',
            'writeDirectory',
            'saveAs',
            'saveFile',
            'writeFile',
        ]);
    }
	writeDirectory () {
	var dirUri = cordova.file.dataDirectory;
	console.log(dirUri);
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
	saveAs (content, fileName) { 
	var dirUri = cordova.file.dataDirectory;
	var _this = this
	window.resolveLocalFileSystemURL(dirUri, function (Entry) {
		Entry.getDirectory("newFile", {
		create: true,
		}, function (dirEntry) {
		dirEntry.getDirectory('project', { create: true }, function (subDirEntry) {
			console.log("this:",_this)
			_this.saveFile(subDirEntry, content, fileName);
		}, ()=>console.log("文件夹创建失败！"));
	
		}, ()=>console.log("文件夹创建失败！"))
	})
	console.log(cordova.file.dataDirectory);
	}
	saveFile (dirEntry, fileData, fileName) {
	let _this = this
	dirEntry.getFile(
		fileName, {
		create: true,
		exclusive: false
	},
		function (fileEntry) {
		_this.writeFile(fileEntry, fileData);
		}, (e)=>console.log('Failed create file: ' + e.toString()));
	}

	writeFile (fileEntry, dataObj) {
	fileEntry.createWriter(function (fileWriter) {
		fileWriter.onwriteend = function () {
	
		};
		fileWriter.onerror = function (e) {
		console.log('Failed file write: ' + e.toString());
		};
		fileWriter.write(dataObj);
	
	});
	}
 
    // downloadProject () {
	// 	console.log(this.props.save)
	// 	return this.props.saveProjectSb3().then(content => {
	// 		if (this.props.onSaveFinished) {
	// 			this.props.onSaveFinished();
	// 		}
	// 		//点击保存： 移动端保存项目到指定文件夹中，
	// 		if(this.props.save){
	// 			return this.saveProjectToFile(content);
	// 		}else{
	// 			// 点击导出：移动端导出项目
	// 			if (window.cordova && (window.cordova.platformId === 'ios' || window.cordova.platformId === 'android')){
	// 				this.writeDirectory()
	// 				this.saveAs(content,this.props.projectFilename);
	// 				// path = cordova.file.dataDirectory
	// 				console.log(this)
	// 				let path = `${cordova.file.dataDirectory}/newFile/project/${this.props.projectFilename}`
	// 				window.plugins.socialsharing.share(null, null, path);
	// 			}else{
	// 				// 桌面端导出
	// 				downloadBlob(this.props.projectFilename, content);
	// 			}
	// 		}
	// 	});
    // }
	downloadProject () {
		console.log(this.props.saveStatus)
		return this.props.saveProjectSb3().then(content => {
			if (this.props.onSaveFinished) {
				this.props.onSaveFinished();
			}
			let projectList = JSON.parse(localStorage.getItem('project-list'));
			if(projectList == null){
				projectList = {};
			}
			let currentID = JSON.parse( sessionStorage.getItem("currentID"));  //当前打开项目的id
			let projectName = this.props.projectFilename.replace(".sb3", "");
			let description;
			let id = this.generateId();
    		( {id, description} = this.newProject(projectName) );
			//点击保存：判断是新建项目或者修改项目或者 copy 项目
			if(this.props.saveStatus == 1){
				if(currentID){
					// 修改项目
					projectList[currentID.id].name = projectName;
                    projectList[currentID.id].updateDate = Date.now();
					this.saveProjectToFile(content);
                    localStorage.setItem("project-list", JSON.stringify(projectList));
					
				}else{
					// 创建新项目
					var hasName = false; // 默认设置为没有找到
					// 遍历 obj 对象的属性
					for (var key in projectList ) {
						// 检查当前属性值的 name 是否与目标 name 相等
						if (projectList .hasOwnProperty(key) && projectList [key].name === projectName) {
							hasName = true; // 找到了 name 变量
							break; // 结束循环，不再继续查找
						}
					}
					if (hasName) {
						// let error = "名称重复";
						let error = 1;
						console.log("名称重复");
						return error;
					} else {
						projectList[id] = description;
						let currentID = {name:projectName,id:description.id};
						sessionStorage.setItem("currentID", JSON.stringify(currentID));
						localStorage.setItem("project-list", JSON.stringify(projectList));
						return this.saveProjectToFile(content);
					}
				}
			}
			// copy 项目
			if(this.props.saveStatus == 3){
				return this.getProjectList().then((projectNameList) => {
					// 检查数组中是否存在相同的元素
					let projectName = this.props.projectFilename.replace(".sb3", "");
					if (projectNameList.includes(projectName)) {
						var i = 1;
						var newName = projectName;
						
						// 生成一个新的不重复的名称
						while (projectNameList.includes(newName)) {
							newName = projectName + "(" + i + ")";
							i++;
						}
						projectName = newName
					}
					( {id, description} = this.newProject(projectName) );;
					projectList[id] = description;
					projectName += ".sb3" ;
					this.saveProjectToFile(content,projectName);
					localStorage.setItem("project-list", JSON.stringify(projectList));
				})
			}
			if(!this.props.saveStatus){
				// 点击导出：移动端导出项目
				if (window.cordova && (window.cordova.platformId === 'ios' || window.cordova.platformId === 'android')){
					this.writeDirectory()
					this.saveAs(content,this.props.projectFilename);
					// path = cordova.file.dataDirectory
					console.log(this)
					let path = `${cordova.file.dataDirectory}/newFile/project/${this.props.projectFilename}`
					window.plugins.socialsharing.share(null, null, path);
				}else{
					// 桌面端导出
					downloadBlob(this.props.projectFilename, content);
				}
				return 2
			}
		});
    }
	
	saveProjectToFile (content,porjectName) {
		return new Promise((resolve, reject) => {
			let url = cordova.file.externalDataDirectory;
            if(cordova.platformId == "ios"){
                url = cordova.file.documentsDirectory;
            }
			var dataName = this.props.projectFilename;
			if(porjectName){
				dataName = porjectName;
			}
			window.resolveLocalFileSystemURL(url, function(dir) {
				console.log("Got main dir",dir);
				//创建或打开名为MyProject的目录
				dir.getDirectory("MyProject", {create:true}, function(subDir) {
					console.log("Got sub dir",subDir);
					//创建文件
					subDir.getFile(dataName, {create:true}, function(file) {
						console.log("Got file",file);
						//写入数据
						var data = content;
						file.createWriter(function(fileWriter) {
							fileWriter.write(data);
							console.log("Write success");
							resolve("success");
						}, function(error){
							console.log("Write error",error);
							reject("success");
						});
					});
				});
			});
		});
	}
	generateId = () => {
		let randomPart = Math.random().toString(36).substring(2, 15);
		let timestampPart = Date.now().toString(36);
		return randomPart + timestampPart;
	}
	newProject = (name) => {
		name = name || "New Project";
		let id = this.generateId();
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
	getProjectList = () => {
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


    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SB3Downloader.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
SB3Downloader.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // oit dispmatch prop
)(SB3Downloader);
