import { Component } from "react";
import TaskForm from "./components/TaskForm";
import Control from "./components/Control";
import TaskList from "./components/TaskList";
class App extends Component {
  // Tạo state sau này mọi việc thêm xóa sửa cập nhật filter đều thực hiện ở đây
  constructor(props) {
    super(props);
    this.state = {
      tasks: [], //Danh sách các task(id: unique , name, status)
      isDisplayForm: false,
    };
  }
  //Cái này là vòng đời của component và cái là nó sẽ được gọi
  componentWillMount() {
    if (localStorage && localStorage.getItem("tasks")) {
      var tasksFake = JSON.parse(localStorage.getItem("tasks"));
      console.log(tasksFake);
      this.setState({
        tasks: tasksFake,
      });
    }
  }
  //Tạo data fake trước
  onGenerateData = () => {
    var tasksFake = [
      {
        id: this.generateID(),
        name: "Học lập trình",
        status: true,
      },
      {
        id: this.generateID(),
        name: "Đi bơi",
        status: false,
      },
      {
        id: this.generateID(),
        name: "Ngủ",
        status: true,
      },
    ];
    this.setState({
      tasks: tasksFake,
    });
    localStorage.setItem("tasks", JSON.stringify(tasksFake));
  };
  //Cái này để tạo random id ngẫu nhiên có thể sử dụng thư viện ngta viết sẵn hoặc là tự viết như này
  s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  generateID() {
    return (
      this.s4() +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4() +
      "-" +
      this.s4()
    );
  }
  onToggleForm = () => {
    this.setState({
      isDisplayForm: !this.state.isDisplayForm,
    });
  };

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false,
    });
  };
  onSubmit = (data) => {
    // let { tasks } = this.state; //tasks = this.state.tasks
    let tasks = this.state.tasks;
    data.id = this.generateID();
    tasks.push(data);
    this.setState({
      tasks: tasks,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  onUpdateStatus = (id) => {
    console.log(id);
    let { tasks } = this.state;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks.tasks.tasks[index].status = !tasks.tasks.tasks[index].status;
      this.setState({
        tasks: tasks,
      });
      localStorage.setItem("tasks", JSON.stringify(this.state));
    }
  };
  findIndex = (id) => {
    let { tasks } = this.state;
    let result = -1;
    tasks.tasks.tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  };
  render() {
    var { tasks, isDisplayForm } = this.state; // Cách viết tương tự var tasks = this.state.tasks
    var elmTaskForm = isDisplayForm ? (
      <TaskForm onSubmit={this.onSubmit} onCloseForm={this.onCloseForm} />
    ) : (
      ""
    );
    return (
      <div className="container">
        <div className="text-center">
          <h1>Quản Lý Công Việc</h1>
          <hr />
        </div>
        <div className="row">
          <div
            className={elmTaskForm ? "col-xs-4 col-sm-4 col-md-4 col-lg-4" : ""}
          >
            {/* Component Form */}
            {elmTaskForm}
          </div>
          <div
            className={
              isDisplayForm
                ? "col-xs-8 col-sm-8 col-md-8 col-lg-8"
                : "col-xs-12 col-sm-12 col-md-12 col-lg-12"
            }
          >
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onToggleForm}
            >
              <span className="fa fa-plus mr-5" />
              Thêm Công Việc
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={this.onGenerateData}
            >
              Generate Data
            </button>
            {/* Search - Sort */}
            <Control />
            {/* List */}
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                 <TaskList
                  tasks={tasks.tasks}
                  onUpdateStatus={this.onUpdateStatus}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
