let employees = [];

const employeeForm = document.getElementById("employeeForm");
const employeeTable = document.getElementById("employeeTable").querySelector("tbody");

employeeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.getElementById("empId").value.trim();
  const name = document.getElementById("empName").value.trim();
  const role = document.getElementById("empRole").value.trim();

  if (!id || !name || !role) {
    alert("Please fill all fields!");
    return;
  }

  const existing = employees.find((emp) => emp.id === id);
  if (existing) {
    existing.name = name;
    existing.role = role;
    alert("Employee updated successfully!");
  } else {
    employees.push({ id, name, role });
    alert("Employee added successfully!");
  }

  employeeForm.reset();
  renderTable();
});

function renderTable() {
  employeeTable.innerHTML = "";

  if (employees.length === 0) {
    employeeTable.innerHTML = `<tr><td colspan="4">No employees found.</td></tr>`;
    return;
  }

  employees.forEach((emp, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${emp.id}</td>
      <td>${emp.name}</td>
      <td>${emp.role}</td>
      <td>
        <button class="action-btn edit-btn" onclick="editEmployee(${index})">Edit</button>
        <button class="action-btn delete-btn" onclick="deleteEmployee(${index})">Delete</button>
      </td>
    `;
    employeeTable.appendChild(row);
  });
}

function editEmployee(index) {
  const emp = employees[index];
  document.getElementById("empId").value = emp.id;
  document.getElementById("empName").value = emp.name;
  document.getElementById("empRole").value = emp.role;
}

function deleteEmployee(index) {
  if (confirm("Are you sure you want to delete this employee?")) {
    employees.splice(index, 1);
    renderTable();
  }
}
