import React from 'react'

const Home = ({appName}) => {
  return (
    <div> <section className="hero-section">
        <div className="container">
            <div className="row align-items-center">
                <div className="col-lg-6">
                    <h1 className="hero-title">Grow Your Business with Smart CRM</h1>
                    <p className="hero-subtitle">{appName }Pro helps you manage customer relationships, automate sales, and boost your revenue with powerful analytics.</p>
                    <div className="d-flex">
                        <a href="#" className="btn btn-primary">Start Free Trial</a>
                        <a href="#" className="btn btn-outline-light">Learn More</a>
                    </div>
                </div>
                <div className="col-lg-6">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/be821f19-edb7-4c7a-80b9-610462374495.png" 
                    alt="Dashboard UI showing customer relationship management application with graphs and customer profiles" className="img-fluid rounded shadow-lg"/>
                </div>
            </div>
        </div>
    </section>

   
    <section className="py-5">
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-6 col-md-2 text-center mb-4">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e2aaf818-f714-49ae-ace2-39050025cdd2.png" alt="Logo of tech company TechCorp" className="img-fluid" style={{opacity: 0.7}}/>
                </div>
                <div className="col-6 col-md-2 text-center mb-4">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1ae1eefa-77d7-4835-90d6-2eb224d3becf.png" alt="Logo of consulting firm BizSolutions" className="img-fluid" style={{opacity: 0.7}} />
                </div>
                <div className="col-6 col-md-2 text-center mb-4">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/16b8a257-1f82-4e3d-a10b-01b90d06055d.png" alt="Logo of marketing agency DigitalMark" className="img-fluid" style={{opacity: 0.7}} />
                </div>
                <div className="col-6 col-md-2 text-center mb-4">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6c1f3cac-7922-4852-91a1-d09cca218837.png" alt="Logo of financial service FinEdge" className="img-fluid" style={{opacity: 0.7}} />
                </div>
                <div className="col-6 col-md-2 text-center mb-4">
                    <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d811f92c-6cdd-4906-9f9b-cd206e1efd10.png" alt="Logo of software company CloudSoft" className="img-fluid" style={{opacity: 0.7}} />
                </div>
            </div>
        </div>
    </section>

    <section className="py-6 bg-light" id="features">
        <div className="container">
            <h2 className="text-center section-title">Powerful Features</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-chart-line"></i>
                        </div>
                        <h3>Sales Analytics</h3>
                        <p>Get real-time insights into your sales pipeline with detailed reports and visual dashboards.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h3>Contact Management</h3>
                        <p>Organize all your customer interactions in one place with advanced segmentation and tagging.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-tasks"></i>
                        </div>
                        <h3>Task Automation</h3>
                        <p>Automate repetitive tasks and follow-ups to focus on what matters most - closing deals.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <h3>Email Integration</h3>
                        <p>Connect your email accounts and track all communication within your CRM.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-mobile-alt"></i>
                        </div>
                        <h3>Mobile App</h3>
                        <p>Access your CRM from anywhere with our native iOS and Android applications.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="feature-card bg-white">
                        <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i>
                        </div>
                        <h3>Data Security</h3>
                        <p>Enterprise-grade security with encryption, backups, and role-based access control.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

   
    <section className="stats-section text-center">
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <div className="stat-number">10,000+</div>
                    <p className="lead">Happy Customers</p>
                </div>
                <div className="col-md-3">
                    <div className="stat-number">95%</div>
                    <p className="lead">Customer Satisfaction</p>
                </div>
                <div className="col-md-3">
                    <div className="stat-number">24/7</div>
                    <p className="lead">Support Available</p>
                </div>
                <div className="col-md-3">
                    <div className="stat-number">5M+</div>
                    <p className="lead">Processed Contacts</p>
                </div>
            </div>
        </div>
    </section>

   
    <section className="py-6">
        <div className="container">
            <h2 className="text-center section-title">What Our Customers Say</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="testimonial-card">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/52792d93-9af6-4fad-89fc-bc72702216d5.png" alt="Portrait of Sarah Johnson, Marketing Director at TechCorp"className="testimonial-img" />
                        <p className="mb-4">"{appName}Pro has transformed how we manage our customer relationships. The automation features saved us at least 10 hours per week in manual follow-ups."</p>
                        <h5>Sarah Johnson</h5>
                        <p className="text-muted">Marketing Director, TechCorp</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="testimonial-card">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/b6a1827d-f49e-4a0b-b5b1-8e0b260cb84a.png" alt="Portrait of Michael Chen, CEO of BizSolutions"className="testimonial-img" />
                        <p className="mb-4">"The analytics dashboard gives me instant visibility into our sales pipeline. We've seen a 30% increase in conversions since implementing {appName}Pro."</p>
                        <h5>Michael Chen</h5>
                        <p className="text-muted">CEO, BizSolutions</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="testimonial-card">
                        <img src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/8c4657fa-f408-4a8d-b086-07dfd89cb398.png" alt="Portrait of Amanda Rodriguez, Sales Manager at DigitalMark"className="testimonial-img" />
                        <p className="mb-4">"Our sales team loves the mobile app - they can update deals on the go and never miss an important follow-up. Customer support is excellent too."</p>
                        <h5>Amanda Rodriguez</h5>
                        <p className="text-muted">Sales Manager, DigitalMark</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    
    <section className="cta-section" id="priceing">
        <div className="container">
            <h2 className="cta-title">Ready to Transform Your Business?</h2>
            <p className="lead mb-5">Join thousands of businesses that trust CRMPro to manage their customer relationships.</p>
            <div className="d-flex justify-content-center">
                <a href="#" className="btn btn-light btn-lg me-3 px-4 py-2">Start Free Trial</a>
                <a href="#" className="btn btn-outline-light btn-lg px-4 py-2">Request Demo</a>
            </div>
        </div>
    </section>
</div>
  )
}

export default Home