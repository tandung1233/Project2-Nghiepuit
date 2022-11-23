import { Component } from "react";
import TaskItem from "./TaskItem";
class TaskList extends Component {
  render() {
    let { tasks } = this.props; //var tasks = this.props.tasks
    // console.log(tasks.tasks)
    let elmTasks = tasks.tasks.map((task, index) => {
      return (
        <TaskItem
          key={task.id}
          index={index}
          task={task}
          onUpdateStatus={this.props.onUpdateStatus}
        />
      );
    });
    return (
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th className="text-center">STT</th>
            <th className="text-center">Tên</th>
            <th className="text-center">Trạng Thái</th>
            <th className="text-center">Hành Động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td />
            <td>
              <input type="text" className="form-control" />
            </td>
            <td>
              <select className="form-control">
                <option value={-1}>Tất Cả</option>
                <option value={0}>Ẩn</option>
                <option value={1}>Kích Hoạt</option>
              </select>
            </td>
            <td />
          </tr>
          {elmTasks}
        </tbody>
      </table>
    );
  }
}

export default TaskList;
