
let Project = {
    DATA_NAME : 'userProjects',
    save(id, data) {
        let userProjects = Project.getProjects();
        userProjects[id] = data;
        localStorage.setItem(Project.DATA_NAME, JSON.stringify(userProjects));
    },
    generateId() {
        let randomPart = Math.random().toString(36).substring(2, 15);
        let timestampPart = Date.now().toString(36);
        return randomPart + timestampPart;
    },
    getProjects() {
        let projects = localStorage.getItem(Project.DATA_NAME);
        if (projects === null || projects === undefined) {
            projects = {};
        } else {
            projects = JSON.parse(projects);
        }
        return projects;
    }
}

export default Project;