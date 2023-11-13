import React from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import shareVideo from "../assets/share.mp4";
import Pix from "../assets/Pix.png";
import { useState, useEffect } from "react";
import { client } from "../client";
const Login = () => {
  const [user, setUser] = useState([]);
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (googleResponse) => {
      console.log(googleResponse);
      setUser(googleResponse);
    },
    onError: (error) => {
      console.log("Login Failed:", error);
    },
  });

  useEffect(() => {
    if (user) {
      const url = `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`;

      fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.access_token}`,
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Request failed with status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          localStorage.setItem("user", JSON.stringify(data));
          const { name, id, picture } = data;

          const doc = {
            _id: id,
            _type: "user",
            userName: name,
            image: picture,
          };

          client.createIfNotExists(doc).then(() => {
            navigate("/", { replace: true });
          });
        })
        .catch((error) => console.error(error));
    }
  }, [user]);

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="relative w-full h-full">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
          <div className="p-5">
            <img
              src={Pix}
              width="130px"
              alt="Pix Portal"
              className="rounded-lg"
            />
          </div>
          <div className="shadow-1xl">
            <button
              type="button"
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg outline-none"
              onClick={() => login()}
            >
              <FcGoogle className="mr-4" />
              Sign in with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
