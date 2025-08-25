import React from 'react'

const Navbar = ({appName}) => {
  return (
    <div>
         <nav className="navbar navbar-expand-lg navbar-light bg-white fixed-top">
        <div className="container">
            <a className="navbar-brand" href="#">{appName}<span className="text-dark">Pro</span></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <a className="nav-link active" href="#">Home</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#features">Features</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#priceing">Pricing</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#footer">Contact</a>
                    </li>
                </ul>
                <div className="ms-3 d-flex">
                    <a href="/signin" className="btn btn-sm btn-outline-primary me-2">Login</a>
                    <a href="/singup" className="btn btn-sm btn-primary">Sign Up</a>
                </div>
            </div>
        </div>
    </nav>
    </div>
  )
}

export default Navbar