"use client"
import Link from 'next/link'
import React from 'react'
import { useForm } from 'react-hook-form';
import { toastError, toastSuccess } from '@/lib/functions';

//todo add icons to inputs
//todo use tailwindcomponents and fowbite
//todo add input labels

const Register = () => {
    const pVal = new RegExp('^' + process.env.NEXT_PUBLIC_P_VAL + '$')
    const usernameVal = new RegExp('^' + process.env.NEXT_PUBLIC_U_VAL + '$')
    const emailVal = new RegExp('^' + process.env.NEXT_PUBLIC_E_VAL + '$')

    const testdata = {
        "firstName": "yaboi",
        "lastName": "queloque",
        "email": "oj1@mail.com",
        "username": "asdcadas",
        "password": "AAAaaa123!"
    }
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = async (data) => {

        try {
            //response is an array
            const response = await fetch("http://localhost:5001/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }).then(res => res.json())
            if (response.error) {
                toastError({ message: response.error })
                return;
            }
            toastSuccess({ message: "account created" });

        } catch (err) {
            console.error(err.message)
        }
    }

    const inputStyle = 'p-2 rounded-sm shadow-md border border-slate-300 focus:outline-none focus:ring-1  focus:ring-slate-600 focus:border-transparent  '
    return (

        <div className='flex flex-col w-1/2 justify-center h-full items-center m-auto'>

            {/* registration form */}
            <form onSubmit={handleSubmit(onSubmit)} className='rounded-md h-fit flex flex-col justify-center  gap-3 p-5'>
                <div className='flex gap-2'>

                    {/* FIRST NAME */}
                    <input required type='text' name='first name' placeholder='first name'
                        maxLength={45}
                        {...register('firstName', { required: true })}
                        className={inputStyle}
                    />

                    {/* LAST name */}
                    <input required type='text' name='last name' placeholder='last name'
                        maxLength={45}
                        {...register('lastName')}
                        className={inputStyle} />
                </div>

                {/* EMAIL */}
                <input required type='email' name="email" placeholder='email'
                    maxLength={95}
                    {...register('email', {
                        required: true,
                        pattern: {
                            value: emailVal,
                            message: "invalid email format"
                        }
                    })}
                    className={inputStyle} />
                {errors.email && <p className='text-xs font-light text-red-900'>{errors.email.message}</p>}


                {/* USERNAME */}
                <input required type='text' name='username' placeholder='username'
                    minLength={5} maxLength={45}
                    {...register('username',
                        {
                            required: true,
                            pattern: {
                                value: usernameVal,
                                message: "username can only contain letters, numbers and underscores"
                            }
                        },)}
                    className={inputStyle}
                />
                {errors.username && <p className='text-xs font-light text-red-900'>{errors.username.message}</p>}

                {/* PASSWORD */}
                <input required name='password' type='password' placeholder='password'
                    {...register('password',
                        {
                            required: true,
                            pattern: { value: pVal, message: "password must include at least 1 special symbol, number, uppercase and lowercase letter" }
                        })}
                    className={inputStyle}
                    minLength={8} maxLength={45}
                />
                {errors.password && <p className='text-xs font-light text-red-900'>{errors.password.message}</p>}

                {/* CONFIRM PASSWORD */}
                <input required type='password' name='confirm_password' placeholder='confirm password'
                    {...register('confirmPass', {
                        required: true,
                        validate: (val) => {
                            if (watch('password') != val) {
                                return "passwords do not match";
                            }
                        },

                    })}
                    className={inputStyle}
                />
                {errors.confirmPass && <p className='text-xs font-light text-red-900'>{errors.confirmPass.message}</p>}

                {/* REGISTER BUTTON */}
                <button type='submit' className=' text-light bg-dark p-2 w-1/2  mx-auto rounded-[4px] border-2 border-transparent  hover:bg-slate-700 transition-colors duration-300 shadow-lg'>
                    Register
                </button>
            </form>
            {/* TEST FETCH BUTTON */}
            {/* <button onClick={() => onSubmit(testdata)} className='bg-red-500'> test fetch</button> */}
            <div className='mt-2 text-dark'>
                <p className='text-base leading-4 font-semibold'> Already have an account? </p>
                <Link href='/login' className='block w-fit text-center mx-auto underline'>sign in</Link>
            </div>
        </div>
    )
}

export default Register