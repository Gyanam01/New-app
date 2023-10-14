import React from "react";

const UserTable = ({ users }) => {
  return (
    <div>
      <h2>User Information</h2>
      <table>
        <thead>
          <tr>
            <th>UserID</th>
            <th>Name</th>
            <th>Available</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.userId}>
              <td>{user.userId}</td>
              <td>{user.name}</td>
              <td>{user.available ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
