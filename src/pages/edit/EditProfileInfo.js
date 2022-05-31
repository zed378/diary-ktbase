// import package
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { KontenbaseClient } from "@kontenbase/sdk";

// import assets
import cssModules from "../../assets/css/EditProfile.module.css";

function EditProfile() {
  const { id } = useParams();

  const kontenbase = new KontenbaseClient({
    apiKey: process.env.REACT_APP_API_KEY,
  });

  let navigate = useNavigate();

  // store data
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });

  const { firstName, lastName, phoneNumber } = form;

  const [user, setUser] = useState([]);

  // alert
  const [success, setSuccess] = useState(false);
  const [fail, setFail] = useState(false);

  const getUser = async () => {
    try {
      const { data, error } = await kontenbase.service("Users").getById(id);
      setUser(data);

      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmitted = async (e) => {
    try {
      e.preventDefault();

      const { data, error } = await kontenbase.service("Users").updateById(id, {
        firstName,
        lastName,
        phoneNumber,
      });

      if (data) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          navigate("/profile");
        }, 1500);
      }
    } catch (error) {
      setFail(true);
      setTimeout(() => {
        setFail(false);
      }, 3000);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className={cssModules.editContainer}>
      <div className={cssModules.formContainer}>
        <form className={cssModules.editForm} onSubmit={onSubmitted}>
          <h1>Edit Profile Info</h1>

          {success ? (
            <h3
              style={{
                color: "green",
                background: "#c5fce5",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
                width: "100%",
              }}
            >
              Edit Profile Success
            </h3>
          ) : (
            <></>
          )}

          {fail ? (
            <h3
              style={{
                color: "red",
                background: "#e0cecc",
                textAlign: "center",
                padding: "0.5rem 0",
                fontSize: "1.15rem",
                fontFamily: "avenirs",
                width: "100%",
              }}
            >
              Edit Profile Failed
            </h3>
          ) : (
            <></>
          )}

          <label htmlFor="name">First Name</label>
          <input
            type="text"
            name="firstName"
            onChange={handleChange}
            value={firstName}
          />
          <label htmlFor="name">Last Name</label>
          <input
            type="text"
            name="lastName"
            onChange={handleChange}
            value={lastName}
          />
          <label htmlFor="phoneNumber">Phone</label>
          <input
            type="number"
            name="phoneNumber"
            onChange={handleChange}
            value={phoneNumber}
          />
          <div className={cssModules.btnWrapper}>
            <button
              className={cssModules.backBtn}
              onClick={() => navigate("/profile")}
            >
              CANCEL
            </button>
            <button type="submit" className={cssModules.saveBtn}>
              SAVE
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
