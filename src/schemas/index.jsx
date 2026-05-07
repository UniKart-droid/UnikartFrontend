import * as Yup from "yup";


export const signUpSchema = Yup.object({
    name: Yup.string().matches(/^[A-Za-z\s]+$/, "Name should contain only letters").min(3).max(25).required("Please enter your name"),
    email : Yup.string().email().required("Enter your Email"),
    password: Yup.string().min(6,"Password must be at least 6 characters").required("Password is required"),
    confirm_password: Yup.string().required("Confirm your password").oneOf([Yup.ref('password'),null], "Password must match"),
    sel_role: Yup.string().required("Please select a role")
})