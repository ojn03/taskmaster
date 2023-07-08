import React from 'react'

const buttonStyle = 'bg-dark text-light'

const Navbar = () => {
    return (
        <div className='flex flex-col gap-3 bg-light w-1/6 p-3'>
            <button className={buttonStyle}>
                DashBoard
            </button>
            <button className={buttonStyle}>
                My tickets
            </button>
            <button className={buttonStyle}>
                Inbox
            </button>
            <button className={buttonStyle}>
                Manage Projects
            </button>
            <button className={buttonStyle}>
                Profile
            </button>
            <button>
                logout
            </button>
        </div>
    )
}

export default Navbar