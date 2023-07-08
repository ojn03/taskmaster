"use client"
import Link from 'next/link'
import { useRef } from 'react'




//todo add icons to inputs
//todo add validation
//todo use tailwindcomponents and fowbite

const PVal = /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[~`!@#$%^&*\(\)\-_\+=\{\}\[\]\|\\:;"'<>,\.\/\? ]).{1,}/.source
//minlength prop of 8 added to input

const usernameVal = /[a-zA-Z0-9_]{1,}/.source
//minlength prop of 4 added to input
//max length prop of 30 added to input

const emailVal = /^[a-z0-9._%+-]+@[a-z0-9.\-]+\.[a-z]{2,4}$/.source


const Register = (e) => {


    const handleSub = (e) => {
        e.preventDefault();
        //validate inputs
        if(document.getElementById('password').value !== document.getElementById('confirm_password').value){
            // do something
            return;
        }
        const submitForm = async () => {
            const form = new FormData(e.target)
            const res = await fetch('//register', {
                method: 'POST',
                body: form
            })
            const json = await res.json()
            console.log(json)
           
        }
    }

    const ref = useRef(null)
    const inputStyle = 'p-2 rounded-sm shadow-md border border-gray-300 focus:outline-none focus:ring-1  focus:ring-indigo-600 focus:border-transparent  '
    return (

        <div className='flex flex-col w-1/2 justify-center h-full items-center m-auto'>
            <form onSubmit={handleSub} ref={ref} className='rounded-md h-2/5 flex flex-col justify-center bg-light gap-3 p-5'>
                <div className='flex gap-2'>
                    <input required type='text' placeholder='first name'
                        maxLength={30}
                        className={inputStyle}
                    />

                    <input required type='text' placeholder='last name'
                        maxLength={30}
                        className={inputStyle} />
                </div>
                <input required type='email' placeholder='email'
                title={'must be a valid email address'}
                maxLength={48} 
                pattern={emailVal}
                className={inputStyle} />
                <input required type='text' placeholder='username'
                    title={'must be between 5 and 30 characters long and can only contain letters, numbers and underscores'}
                    className={inputStyle}
                    minLength={5} maxLength={30} pattern={usernameVal} />
                <input required  id='password' type='password' placeholder='password' title='include 1 special symbol, 1 number, 1 uppercase and 1 lowercase letter'
                    className={inputStyle}
                     minLength={9} maxLength={30} pattern={PVal}/>
                <input required type='password' id='confirm_password' placeholder='confirm password'  
                className={inputStyle} /> <span id='message'></span>
                <button type='submit' className=' text-light bg-indigo-600/90 p-2 w-1/2 mt-3 mx-auto rounded-[4px] border-2 border-transparent  hover:bg-indigo-700 hover:border-indigo-700 transition-colors duration-300 shadow-lg'>
                    Register
                </button>
            </form>
            <div className='mt-4'>
                <p className='text-md font-semibold text-[#DDE546]'> Already have an account? </p>
                <Link href='/login' className='block w-fit text-center mx-auto text-light underline underline-offset-[3px]'>sign in</Link>
            </div>
        </div>
    )
}

export default Register