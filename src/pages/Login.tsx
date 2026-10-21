import {useForm} from "react-hook-form";
const Login = () => {
  const {register, handleSubmit} = useForm({
    
    defaultValues: {
      email: "",
      password: ""
    }
});
  const onSubmit = handleSubmit((data) => {
    console.log(data);
  })

}
export default Login