// Elements
const form = document.getElementById('student-form');
const tableBody = document.getElementById('table-body');
const clearAllBtn = document.getElementById('clear-all');

// Array to store students
let students = [];

// Max marks per subject and total
const maxMarksPerSubject = 100;
const numSubjects = 5;
const maxTotal = maxMarksPerSubject * numSubjects;

// Function to calculate grade based on percentage
function getGrade(percentage) {
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
}

// Function to add student
function addStudent(name, marks) {
    const total = marks.reduce((sum, mark) => sum + mark, 0);
    const percentage = (total / maxTotal) * 100;
    const grade = getGrade(percentage);
    
    const student = {
        name,
        marks,
        total,
        percentage: percentage.toFixed(2),
        grade
    };
    
    students.push(student);
    updateTable();
}

// Function to update table
function updateTable() {
    tableBody.innerHTML = '';
    students.forEach(student => {
        const row = document.createElement('tr');
        const isPass = parseFloat(student.percentage) >= 50;
        row.classList.add(isPass ? 'pass' : 'fail');
        
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.marks[0]}</td>
            <td>${student.marks[1]}</td>
            <td>${student.marks[2]}</td>
            <td>${student.marks[3]}</td>
            <td>${student.marks[4]}</td>
            <td>${student.total}</td>
            <td>${student.percentage}%</td>
            <td>${student.grade}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Form submit event
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const marks = [
        parseInt(document.getElementById('sub1').value),
        parseInt(document.getElementById('sub2').value),
        parseInt(document.getElementById('sub3').value),
        parseInt(document.getElementById('sub4').value),
        parseInt(document.getElementById('sub5').value)
    ];
    
    // Basic validation
    if (marks.some(mark => isNaN(mark) || mark < 0 || mark > 100)) {
        alert('Please enter valid marks (0-100) for all subjects.');
        return;
    }
    
    addStudent(name, marks);
    form.reset();
});

// Clear all button
clearAllBtn.addEventListener('click', () => {
    students = [];
    updateTable();
});