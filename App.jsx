import React, { useState, useEffect } from "react";

/* ================= LOCAL STORAGE KEYS ================= */

const STUDENTS_KEY = "students";
const SESSION_KEY = "student_session";

/* ================= LOCAL STORAGE FUNCTIONS ================= */

const getStudents = () =>
  JSON.parse(localStorage.getItem(STUDENTS_KEY)) || [];

const saveStudents = (students) =>
  localStorage.setItem(
    STUDENTS_KEY,
    JSON.stringify(students)
  );

const saveSession = (student) =>
  localStorage.setItem(
    SESSION_KEY,
    JSON.stringify(student)
  );

const getSession = () =>
  JSON.parse(localStorage.getItem(SESSION_KEY));

const clearSession = () =>
  localStorage.removeItem(SESSION_KEY);

/* ================= REUSABLE INPUT ================= */

function InputField({
  type,
  name,
  placeholder,
  value,
  onChange,
  autoComplete,
}) {
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={autoComplete}
      required
    />
  );
}

/* ================= SIGNUP PAGE ================= */

function Signup({ setPage }) {
  const [form, setForm] = useState({
    name: "",
    roll: "",
    course: "",
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const students = getStudents();

    if (!form.email.includes("@")) {
      setError("Enter valid email");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain minimum 6 characters"
      );
      return;
    }

    const alreadyExists = students.some(
      (student) =>
        student.email === form.email
    );

    if (alreadyExists) {
      setError(
        "Student already registered"
      );
      return;
    }

    const newStudent = {
      id: Date.now(),
      ...form,
    };

    saveStudents([
      ...students,
      newStudent,
    ]);

    alert("Signup Successful");

    setForm({
      name: "",
      roll: "",
      course: "",
      email: "",
      password: "",
    });

    setPage("login");
  }

  return (
    <div className="container">
      <div className="box">

        <h1>Student Signup 👩‍🎓</h1>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
        >

          <InputField
            type="text"
            name="name"
            placeholder="Enter Name"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />

          <InputField
            type="text"
            name="roll"
            placeholder="Enter Roll Number"
            value={form.roll}
            onChange={handleChange}
            autoComplete="off"
          />

          <InputField
            type="text"
            name="course"
            placeholder="Enter Course"
            value={form.course}
            onChange={handleChange}
            autoComplete="off"
          />

          <InputField
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="new-email"
          />

          <InputField
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Signup
          </button>

        </form>

        <p className="linkText">
          Already have account?

          <span
            onClick={() =>
              setPage("login")
            }
          >
            Login
          </span>
        </p>

      </div>
    </div>
  );
}

/* ================= LOGIN PAGE ================= */

function Login({
  setPage,
  setStudent,
}) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] =
    useState("");

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    const students = getStudents();

    const foundStudent =
      students.find(
        (student) =>
          student.email ===
            form.email &&
          student.password ===
            form.password
      );

    if (!foundStudent) {
      setError(
        "Invalid Email or Password"
      );
      return;
    }

    saveSession(foundStudent);

    setStudent(foundStudent);

    alert("Login Successful");

    setPage("dashboard");
  }

  return (
    <div className="container">
      <div className="box">

        <h1>Student Login</h1>

        <form
          onSubmit={handleSubmit}
          autoComplete="off"
        >

          <input
            type="text"
            name="fakeuser"
            style={{ display: "none" }}
          />

          <input
            type="password"
            name="fakepassword"
            style={{ display: "none" }}
          />

          <InputField
            type="email"
            name="email"
            placeholder="Enter Email"
            value={form.email}
            onChange={handleChange}
            autoComplete="new-email"
          />

          <InputField
            type="password"
            name="password"
            placeholder="Enter Password"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />

          {error && (
            <p className="error">
              {error}
            </p>
          )}

          <button type="submit">
            Login
          </button>

        </form>

        <p className="linkText">
          Don't have account?

          <span
            onClick={() =>
              setPage("signup")
            }
          >
            Signup
          </span>
        </p>

      </div>
    </div>
  );
}

/* ================= DASHBOARD ================= */

function Dashboard({
  student,
  logout,
}) {
  return (
    <div className="container">

      <div className="box dashboard">

        <h1>Dashboard</h1>

        <h2>
          Welcome {student.name}
        </h2>

        <div className="details">

          <p>
            <strong>
              Roll No:
            </strong>{" "}
            {student.roll}
          </p>

          <p>
            <strong>
              Course:
            </strong>{" "}
            {student.course}
          </p>

          <p>
            <strong>
              Email:
            </strong>{" "}
            {student.email}
          </p>

        </div>

        <button onClick={logout}>
          Logout
        </button>

      </div>

    </div>
  );
}

/* ================= MAIN APP ================= */

export default function App() {

  const [page, setPage] =
    useState("login");

  const [student, setStudent] =
    useState(null);

  useEffect(() => {

    const loggedStudent =
      getSession();

    if (loggedStudent) {
      setStudent(loggedStudent);
      setPage("dashboard");
    }

    const style =
      document.createElement("style");

    style.innerHTML = `

*{
  margin:0;
  padding:0;
  box-sizing:border-box;
}

body{
  font-family:Arial,sans-serif;
  background:linear-gradient(
    135deg,
    #020617,
    #0f172a,
    #1e3a8a
  );
  min-height:100vh;
}

.container{
  display:flex;
  justify-content:center;
  align-items:center;
  min-height:100vh;
  padding:20px;
}

.box{
  width:100%;
  max-width:400px;
  padding:35px;
  border-radius:22px;
  background:rgba(255,255,255,0.08);
  backdrop-filter:blur(14px);
  border:none;
  outline:none;
  box-shadow:0 10px 35px rgba(0,0,0,0.4);
  animation:fadeIn 0.5s ease;
}

h1{
  text-align:center;
  color:#ffffff;
  margin-bottom:25px;
  font-size:32px;
}

h2{
  color:#ffffff;
  margin-top:12px;
  text-align:center;
}

input{
  width:100%;
  padding:14px;
  margin-top:15px;
  border:none;
  border-radius:12px;
  outline:none;
  font-size:15px;
  background:rgba(255,255,255,0.12);
  color:white;
  transition:0.3s;
}

input::placeholder{
  color:#cbd5e1;
}

input:focus{
  background:rgba(255,255,255,0.18);
  box-shadow:0 0 10px rgba(255,255,255,0.2);
}

button{
  width:100%;
  padding:14px;
  margin-top:20px;
  border:none;
  border-radius:12px;
  background:#ffffff;
  color:#0f172a;
  font-size:16px;
  font-weight:bold;
  cursor:pointer;
  transition:0.3s;
}

button:hover{
  background:#dbeafe;
  transform:translateY(-2px);
}

.linkText{
  text-align:center;
  margin-top:20px;
  color:#ffffff;
}

span{
  color:#bfdbfe;
  margin-left:6px;
  font-weight:bold;
  cursor:pointer;
}

.error{
  color:#fecaca;
  margin-top:10px;
  font-size:14px;
}

.dashboard .details{
  margin-top:25px;
  line-height:2;
  color:#ffffff;
  background:rgba(255,255,255,0.08);
  padding:18px;
  border-radius:14px;
}

strong{
  color:#dbeafe;
}

@keyframes fadeIn{

  from{
    opacity:0;
    transform:translateY(20px);
  }

  to{
    opacity:1;
    transform:translateY(0);
  }

}

`;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };

  }, []);

  function logout() {
    clearSession();
    setStudent(null);
    setPage("login");
  }

  if (page === "signup") {
    return (
      <Signup setPage={setPage} />
    );
  }

  if (page === "login") {
    return (
      <Login
        setPage={setPage}
        setStudent={setStudent}
      />
    );
  }

  return (
    <Dashboard
      student={student}
      logout={logout}
    />
  );
}