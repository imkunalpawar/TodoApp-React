import React from 'react';
import Fire from './../config/fire';
import '../App.css';
import Loader from './loader';
import editIcon from './../resource/edit.png';
import deleteIcon from './../resource/delete.png';
import plusIcon from './../resource/plus.png';
import updateIcon from './../resource/updated.png';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      task: '',
      description: '',
      id: null,
      loading: true,
      edit: false,
      allTask: [],
    };
  }
  scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  getUser = () => {
    let userMail = localStorage.getItem('email');
    return userMail.substring(0, userMail.indexOf('@'));
  };
  logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    Fire.auth().signOut();
  };

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    })
  };

  addTask = (event) => {
    if (this.state.task === '') {
      event.preventDefault();
      alert('Type Something ');
    } else {
      event.preventDefault();
      // add data to DB
      Fire.database()
        .ref('todo/')
        .child(this.getUser())
        .push({
          task: this.state.task,
          description: this.state.description,
          status: 'ACT',
        })
        .then((user) => (this.getUserTask()))
        .catch((e) => {
          console.log('Error in Add:', e);
        });
    }
  };



  saveUpdateTask = (event) => {
    event.preventDefault();
    const { id, task, description, allTask } = this.state;
    // console.log('ID', id);
    const originalTasks = [...allTask];
    // console.log('all', originalTasks);
    const taskId = id;
    const taskName = task;
    const taskDescription = description;
    const updateTask = originalTasks.filter((item) => item.id !== id);
    updateTask.unshift({ task: task, description: description, id: id, status: 'ACT' });
    this.setState({ allTask: updateTask, task: '', description: '', edit: false, id: null });


    Fire.database()
      .ref('todo/')
      .child(this.getUser())
      .child(taskId)
      .set({
        task: taskName,
        description: taskDescription,
        status: 'ACT',
      })
      .then((update) => {
        console.log('update:', update);
              //  this.getUserTask();
        // console.log('update:', update);

      })
      .catch((e) => {
        // console.log('error in update', e);
        this.setState({ allTask: originalTasks });
      });
  };

  updateTask = (item) => {
    this.scrollToTop();
    this.setState({ id: item.id, task: item.task, description: item.description, edit: true });
  };


  removeTask = (id) => {
    Fire.database()
      .ref('todo/')
      .child(this.getUser())
      .child(id)
      .remove()
      .then((user) => {
        console.log('Delete:', user);
        this.getUserTask();
      })
      .catch((e) => console.log('Delete error', e));
  };

  getUserTask = () => {
    let tasks = [];
    Fire.database()
      .ref('todo/')
      .child(this.getUser())
      .once('value')
      .then((snapshot) => {
        // console.log('user obj', snapshot.val());
        snapshot.forEach((item) => {
          tasks.unshift({ id: item.key, ...item.val() });
        });
        this.setState({
          allTask: tasks,
          task: '',
          description: '',
          loading: false,
          edit: false,
        });
      })
      .catch((e) => console.log('fetch data error:', e));
  };

  componentDidMount() {
    // get data from DB
    this.getUserTask();
  }

  generateNavBar = () => {
    return (
      <section className="hero mb-4">
        <nav>
          <h2>Todo Application</h2>
          <button onClick={this.logout}> Logout</button>
        </nav>
      </section>
    );
  };

  generateTodoAddForm = () => {
    const { edit } = this.state;
    return (
      <div>
        <form className="w-50" style={{margin: 'auto'}}>
          <div className="col-sm-12">
            <div className="form-group mb-4">
              <input
                type="text"
                name="task"
                className="form-control w-100"
                id="task"
                value={this.state.task}
                placeholder="Enter task"
                onChange={this.handleChange} />
            </div>
            <div className="form-group mb-4">
              <input
                type="text"
                name="description"
                className="form-control w-100"
                id="description"
                value={this.state.description}
                placeholder="Enter Description"
                onChange={this.handleChange}
              />
            </div>
          </div>

          <div className=" col-sm-12 col-md-4" style={{width: '50%', margin: 'auto'}}>
            {edit ? (
              <button type="submit" onClick={this.saveUpdateTask} className="btn btn-primary btn-block" >
                 <img src={updateIcon} alt="update" className=" p-2" width="40" height="40" />      
                Update Task
              </button>
            ) : (
              <button type="submit" onClick={this.addTask} className="btn btn-primary btn-block" >
                 <img src={plusIcon} alt="add" className=" p-2" width="40" height="40" />
                Add Task
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };

  generateTodoListItems = () => {
    const { allTask } = this.state;
    return (
            <div className="taskContainer m-4">
              {allTask &&
                allTask.map((item) => (
                  <div key={item.id} className="card border-primary mb-3">
                      <p className="todo__name">{item.task}</p>
                      <p className="todo__description">{item.description}</p>
                      <div className="footer-primary">
                      <div style={{float: 'right'}}>
                          <img
                            src={editIcon}
                            alt="edit"
                            className=" p-2"
                            width="40"
                            height="40"
                            onClick={() => this.updateTask(item)}
                          />
                          <img
                            src={deleteIcon}
                            alt="delete"
                            className=" ml-5 p-2"
                            width="40"
                            height="40"
                            onClick={() => this.removeTask(item.id)}
                          />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
    );
  };

  render() {
    const { loading } = this.state;
    return (
      <div className=".container-fluid">
        {this.generateNavBar()}
        {this.generateTodoAddForm()}
        {loading ? <Loader /> : this.generateTodoListItems()}
      </div>
    );
  }
}

export default Home;
