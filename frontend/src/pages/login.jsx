import "./login.css";

export default function Login() {
    return(
        <div className="body-login">
            <div className="card">
                <h1>Log in</h1>
                <p>Don't have an account? Sign up!</p>

                <div className="input-fields">
                    <input type="text" placeholder="Enter Email" name="email" required></input>
                    <input type="password" placeholder="Enter Password" name="password" required></input>
                    <button className="button">Log in</button>
                </div>

               
            </div>
        </div>
    );
}