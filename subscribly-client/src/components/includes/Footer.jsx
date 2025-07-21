import React from 'react'

const Footer = ({ appName }) => {
    return (
        <div>
            <footer id="footer">
                <div className="container">
                    <div className="row">
                        <div className="col-md-3 mb-4">
                            <h5 className="text-white mb-4">{appName} Pro</h5>
                            <p>The complete CRM solution for growing businesses. Manage relationships, automate sales, and boost revenue.</p>
                            <div className="mt-4">
                                <a href="#" className="social-icon"><i className="fab fa-facebook-f"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-twitter"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-linkedin-in"></i></a>
                                <a href="#" className="social-icon"><i className="fab fa-instagram"></i></a>
                            </div>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5 className="text-white mb-4">Product</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="footer-link">Features</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Pricing</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Integrations</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Updates</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Roadmap</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5 className="text-white mb-4">Resources</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="footer-link">Documentation</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Guides</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Blog</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Webinars</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Help Center</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mb-4">
                            <h5 className="text-white mb-4">Company</h5>
                            <ul className="list-unstyled">
                                <li className="mb-2"><a href="#" className="footer-link">About Us</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Careers</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Contact</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Privacy</a></li>
                                <li className="mb-2"><a href="#" className="footer-link">Terms</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="my-4 bg-secondary" />
                    <div className="row">
                        <div className="col-md-6 text-center text-md-start">
                            <p className="mb-0">© 2025 {appName}Pro. All rights reserved.</p>
                        </div>
                        <div className="col-md-6 text-center text-md-end">
                            <p className="mb-0">Made with <i className="fas fa-heart text-danger"></i> for businesses</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

export default Footer