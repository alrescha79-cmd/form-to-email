import { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";

// Komponen Form
function EmailForm({ onSubmit }) {
  const form = useRef();
  const [sending, setSending] = useState(false); 

  useEffect(() => {
    const adjustTextareaHeight = () => {
      const textarea = form.current.querySelector("textarea");
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 12 * 20)}px`;
    };

    form.current.querySelector("textarea").addEventListener("input", adjustTextareaHeight);
    return () => {
      form.current.querySelector("textarea").removeEventListener("input", adjustTextareaHeight);
    };
  }, []);

  const sendEmail = (e) => {
    e.preventDefault();
    setSending(true);

    onSubmit(form.current)
      .then(() => {
        form.current.reset();
        setSending(false); 
      })
      .catch(() => {
        setSending(false);
      });
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="flex flex-col border p-4 rounded-lg backdrop-blur shadow-md" >
      <label>Name</label>
      <input type="text" name="from_name" placeholder="Your Name" className="rounded  focus:outline-none active:outline-none mb-2 h-10" />
      <label>Email</label>
      <input type="email" name="from_email" placeholder="name@email.com" className="rounded  focus:outline-none active:outline-none mb-2 h-10" />
      <label>Message</label>
      <textarea name="message" placeholder="Your message" rows="3" className="rounded  focus:outline-none active:outline-none mb-2" />
      <input type="submit" value={sending ? "Sending..." : "Send"} disabled={sending} className="bg-blue-600 text-white p-2 rounded-lg font-bold cursor-pointer hover:bg-blue-700 duration-200" />
    </form>
  );
}

// Komponen Utama
function App() {
  const sendEmail = (form) => {
    return emailjs
      .sendForm("service_6swtmhw", "template_z59khur", form, {
        publicKey: "kv_9L5Vl7r2e6MPyC",
      })
      .then(
        () => {
          Swal.fire({
            position: "center",
            icon: "success",
            title: "Your message has been sent successfully!",
            showConfirmButton: false,
            timer: 2000
          });
        },
        (error) => {
          Swal.fire({
            icon: "error",
            title: "FAILED..",
            text: "Something went wrong!",
            footer: error.text
          });
          throw error; 
        }
      );
  };

  return (
    <div className="w-full h-full bg-blue-300">
      <div className=" w-full h-screen flex flex-col justify-center items-center">
        <div className="mb-4 text-center">
          <h1 className="text-3xl font-bold mb-2 ">Form to Email </h1>
          <p>This is a simple form that sends an email using EmailJS.</p>
        </div>
        <EmailForm onSubmit={sendEmail} />
      </div>
    </div>
  );
}

export default App;