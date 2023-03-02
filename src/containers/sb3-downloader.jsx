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
 
    downloadProject () {
        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            if (window.cordova && (window.cordova.platformId === 'ios' || window.cordova.platformId === 'android')){
                this.writeDirectory()
                this.saveAs(content,this.props.projectFilename);
                // path = cordova.file.dataDirectory
                console.log(this)
                let path = `${cordova.file.dataDirectory}/newFile/project/${this.props.projectFilename}`
                window.plugins.socialsharing.share(null, null, path);
            }else{
                downloadBlob(this.props.projectFilename, content);
            }
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
    () => ({}) // omit dispatch prop
)(SB3Downloader);
