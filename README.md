# Interactive Authentication
An interactive login system with strong password safety.

## Introduction
For this project, we built an interactive login system with Javascript with RSA type cryptography. Using the acquired password as a key to the hash value, our algorithm satisfies the zero knowledge property. With help of the **Miller-Raben** primality test, we computed two random 50-bit prime numbers and used their product to encode our w value. Since Javascript restricts mathematical operations to 32-bit integers, we made use of the library function **bigInt()** to generate 50-bit integers and then perform calculations on them.

Our end result was a *w* value and a password value, stored on the client's local storage while the hashed numeric *v* and *N* are stored on the server along with the user's email ID.

## Results and Limitations
We linked our algorithm with an interactive front end web Application where users can easily register and login with an email ID and a chosen password. Though this system is very secure, authentication is device specific since the *w* and password values are stored locally. A better alternative would be to use the random generated prime numbers to encode the password in place of the *w* value and then send this hash values to the server. Though this won't fulfill the zero knowledge property, this will be more secure and accessible as users can login with their user ID from any device.

## Installation Details
To install and run this Web Application, the latest version of `npm` needs to be installed on the host device.

To run the code, follow the given steps:
* Clone the repository using `git clone https://github.com/neerajp99/interactive_auth.git` or unpack the zip file.
* `cd` the cloned repository and run the `npm install` command on this folder.
* `cd` the "client" folder and run the `npm install` command on this folder.
* Go back to the main directory and run `npm run dev` command to start the development server.
* The server will initiate and the Application window will open on `localhost:PORT`

**Note:** A .txt file is saved with your password, the *v* and the *N* value.
