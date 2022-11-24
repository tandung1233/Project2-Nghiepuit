import { Component } from "react";
import TaskForm from "./components/TaskForm";
import Control from "./components/Control";
import TaskList from "./components/TaskList";
class App extends Component {
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

  // Tạo state sau này mọi việc thêm xóa sửa cập nhật filter đều thực hiện ở đây
  constructor(props) {
    super(props);
    this.state = {
      tasks: [], //Danh sách các task(id: unique , name, status)
      isDisplayForm: false,
      taskEditing: null, //Task đang edit
      filter: {
        name: "",
        status: -1,
      },
      keyword: "",
      sortBy: "name",
      sortValue: 1,
    };
  }
  //Cái này là vòng đời của component và cái là nó sẽ được gọi
  componentWillMount() {
    if (localStorage && localStorage.getItem("tasks")) {
      let ObjectLayTuStorage = JSON.parse(localStorage.getItem("tasks"));
      this.setState({
        tasks: ObjectLayTuStorage,
      });
    }
  }
  //Tạo data fake trước
  onGenerateData = () => {
    var tasksFake = [
      {
        id: 1,
        name: "Học lập trình",
        status: true,
      },
      {
        id: 2,
        name: "Đi bơi",
        status: false,
      },
      {
        id: 3,
        name: "Ngủ",
        status: true,
      },
    ];
    this.setState({
      tasks: tasksFake,
    });
    localStorage.setItem("tasks", JSON.stringify(tasksFake));
  };

  onToggleForm = () => {
    if (this.state.isDisplayForm && this.state.taskEditing != null) {
      this.setState({
        isDisplayForm: true,
        taskEditing: null,
      });
    } else {
      this.setState({
        isDisplayForm: !this.state.isDisplayForm,
        taskEditing: null,
      });
    }
  };

  onCloseForm = () => {
    this.setState({
      isDisplayForm: false,
    });
  };
  onSubmit = (data) => {
    // let { tasks } = this.state; //tasks = this.state.tasks
    let tasks = this.state.tasks;
    if (data.id === "") {
      data.id = this.generateID();
      tasks.push(data);
    } else {
      let index = this.findIndex(data.id);
      tasks[index] = data;
    }
    this.setState({
      tasks: tasks,
      taskEditing: null,
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  };
  onUpdateStatus = (id) => {
    // let { tasks } = this.state;
    let tasks = this.state.tasks;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks[index].status = !tasks[index].status;
      this.setState({
        tasks: tasks,
      });
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
  };
  findIndex = (id) => {
    let { tasks } = this.state;
    let result = -1;
    tasks.forEach((task, index) => {
      if (task.id === id) {
        result = index;
      }
    });
    return result;
  };
  //Delete
  onDelete = (id) => {
    let tasks = this.state.tasks;
    let index = this.findIndex(id);
    if (index !== -1) {
      tasks.splice(index, 1);
      this.setState({
        tasks: tasks,
      });
      localStorage.setItem("tasks", JSON.stringify(this.state.tasks));
    }
    this.onCloseForm();
  };
  //Show form
  onShowForm = () => {
    this.setState({
      isDisplayForm: true,
    });
  };
  //Update

  onUpdate = (id) => {
    let tasks = this.state.tasks;
    let index = this.findIndex(id);
    let taskEditing = tasks[index];
    this.setState({
      taskEditing: taskEditing,
    });
    this.onShowForm();
  };
  onFilter = (filterName, filterStatus) => {
    filterStatus = parseInt(filterStatus, 10);
    this.setState({
      filter: {
        name: filterName.toLowerCase(),
        status: filterStatus,
      },
    });
  };
  onSearch = (keyword) => {
    this.setState({
      keyword: keyword,
    });
  };
  onSort = (sortBy, sortValue) => {
    this.setState({
      sortBy: sortBy,
      sortValue: sortValue,
    });
  };
  render() {
    // var { tasks, isDisplayForm } = this.state; // Cách viết tương tự var tasks = this.state.tasks
    let tasks = this.state.tasks;
    let isDisplayForm = this.state.isDisplayForm;
    let taskEditing = this.state.taskEditing;
    let filter = this.state.filter;
    let keyword = this.state.keyword;
    let sortBy = this.state.sortBy;
    let sortValue = this.state.sortValue;
    if (filter) {
      if (filter.name) {
        tasks = tasks.filter((task) => {
          return task.name.toLowerCase().indexOf(filter.name) !== -1;
        });
      }
      tasks = tasks.filter((task) => {
        if (filter.status === -1) {
          return task;
        } else {
          return task.status === (filter.status === 1 ? true : false);
        }
      });
    }
    if (keyword) {
      tasks = tasks.filter((task) => {
        return task.name.toLowerCase().indexOf(keyword) !== -1;
      });
    }
    if (sortBy === "name") {
      tasks.sort((a, b) => {
        if (a.name > b.name) return sortValue;
        else if (a.name < b.name) return -sortValue;
        else return 0;
      });
    } else {
      tasks.sort((a, b) => {
        if (a.status > b.status) return -sortValue;
        else if (a.status < b.status) return +sortValue;
        else return 0;
      });
    }
    let elmTaskForm = isDisplayForm ? (
      <TaskForm
        onSubmit={this.onSubmit}
        onCloseForm={this.onCloseForm}
        task={taskEditing}
      />
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
            <Control
              onSearch={this.onSearch}
              onSort={this.onSort}
              sortBy={sortBy}
              sortValue={sortValue}
            />
            {/* List */}
            <div className="row mt-15">
              <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <TaskList
                  tasks={tasks}
                  onUpdateStatus={this.onUpdateStatus}
                  onDelete={this.onDelete}
                  onUpdate={this.onUpdate}
                  onFilter={this.onFilter}
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
