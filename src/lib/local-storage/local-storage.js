const Asset = require('./asset');
const _AssetType = require('./asset-type');
const _DataFormat = require('./data-format');
import defaultProject from '../default-project';

class LocalStorage {
    constructor() {
        this.assetDatas = {};
        this.projectList = {};
        this.init();
        this.newProject = this.newProject.bind(this);
    }
    init = () => {
        for (let key in this.AssetType) {
            this.assetDatas[key] = this._get("asset-" + key, {});
        }
        this.projectList = this._get("project-list", {});

        const defaultProjectAssets = defaultProject();
        defaultProjectAssets.forEach(asset => this.store(
            this.AssetType[asset.assetType],
            this.DataFormat[asset.dataFormat],
            asset.data,
            asset.id
        ));
    }

    get AssetType() {
        return _AssetType;
    }

    get DataFormat() {
        return _DataFormat;
    }

    get ProjectList() {
        return this.projectList;
    }

    _get = (name, defaultValue) => {
        let value = window.localStorage.getItem(name);
        if (value === null || value === undefined) {
            value = defaultValue;
        } else {
            try {
                value = JSON.parse(value);
            } catch (e) {
                value = defaultValue;
            }
        }
        return value;
    }

    store = (assetType, dataFormat, data, assetId) => {
        dataFormat = dataFormat || assetType.runtimeFormat;
        switch (dataFormat) {
            case this.DataFormat.JSON:
                data = JSON.stringify(data);
                break;
            case this.DataFormat.WAV:
                data = Array.from(data);
                break;
        }
        this.assetDatas[assetType.name][assetId] = data
        window.localStorage.setItem("asset-" + assetType.name, JSON.stringify(this.assetDatas[assetType.name]));
        return Promise.resolve({
            status: 'ok',
            id: assetId
        });
    }
    load = (assetType, assetId, dataFormat) => {
        dataFormat = dataFormat || assetType.runtimeFormat;
        let data = this.assetDatas[assetType.name][assetId];

        switch (dataFormat) {
            case this.DataFormat.JSON:
                // data = JSON.parse(data);
                break;
            case this.DataFormat.WAV:
                data = Uint8Array.from(data);
                break;
        }
        if (dataFormat === this.DataFormat.JSON) {
            data = JSON.parse(data);
        }
        if (data) {
            const asset = new Asset(assetType, assetId, dataFormat, data);
            return Promise.resolve(asset);
        } else {
            return Promise.resolve(null);
        }
    }
    generateId = () => {
        let randomPart = Math.random().toString(36).substring(2, 15);
        let timestampPart = Date.now().toString(36);
        return randomPart + timestampPart;
    }
    newProject = (name) => {
        name = name || "New Project";
        let id = this.generateId();
        this.projectList[id] = {
            id: id,
            name: name,
            createDate: Date.now(),
            updateDate: Date.now(),
        }
        localStorage.setItem("project-list", JSON.stringify(this.projectList));
        return id;
    }
    saveProject = (id, data, options) => {
        if (options) {
            if (options.isNew) {
                id = this.newProject(options.title);
            } else if (options.isCopy || options.isRemix) {
                id = this.newProject(options.title);
                data = this.assetDatas[this.AssetType.Project][options.origialId];
            }
        } else {
            this.projectList[id].updateDate = Date.now();
            localStorage.setItem("project-list", JSON.stringify(this.projectList));
        }
    
        return this.store(this.AssetType.Project, this.DataFormat.JSON, data, id);
    }
}

export default new LocalStorage();