class StudentModel {
this.view = view;


// seed with sample data if empty
this.model.seed([
{ name: 'Aisha Sharma', age: 16, grade: '10-A' },
{ name: 'Rohit Verma', age: 18, grade: '12-B' },
{ name: 'Meera Patel', age: 15, grade: '9-C' }
]);


// wire view events
this.view.bindAdd(this._handleForm.bind(this));
this.view.onEvent(this._handleListControls.bind(this));
this.view.onAction(this._handleRowAction.bind(this));


this._refresh();
}


_handleForm(type, id, data){
if(type === 'add'){
this.model.add(data);
} else if(type === 'update'){
this.model.update(id, data);
}
this._refresh();
}


_handleRowAction(action, payload){
if(action === 'edit'){
const student = this.model.find(payload);
if(student) this.view.fillForm(student);
} else if(action === 'delete'){
this.model.remove(payload);
this._refresh();
}
}


_handleListControls(_, opts){
const q = (opts.q || '').trim().toLowerCase();
let list = this.model.list();


if(q){
list = list.filter(s => s.name.toLowerCase().includes(q) || s.grade.toLowerCase().includes(q));
}


const sort = opts.sort || 'added-desc';
list.sort((a,b) => {
switch(sort){
case 'added-asc': return new Date(a.createdAt) - new Date(b.createdAt);
case 'added-desc': return new Date(b.createdAt) - new Date(a.createdAt);
case 'name-asc': return a.name.localeCompare(b.name);
case 'name-desc': return b.name.localeCompare(a.name);
default: return 0;
}
});


this.view.renderList(list);
}


_refresh(){
// render full list
this.view.renderList(this.model.list());
}
}


// ---------- BOOTSTRAP ----------
document.addEventListener('DOMContentLoaded', () => {
const model = new StudentModel();
const view = new StudentView();
const controller = new StudentController(model, view);
});