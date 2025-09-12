import { useState, useEffect } from 'react';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlanSelection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  // Fetch plans from backend
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/plans'); // Adjust the URL if needed
        const data = await res.json();

        // Decode features JSON (if needed)
        const formattedPlans = data.map(plan => ({
          id: plan.id,
          name: plan.name,
          price: {
            monthly: plan.price,
            annually: plan.price * 0.8, // Example: 20% discount for annual
          },
          features: typeof plan.features === 'string' ? JSON.parse(plan.features) : plan.features,
          cta: plan.name === 'Basic' ? 'Start Free Trial' : plan.name === 'Pro' ? 'Purchase Now!' : 'Contact Sales',
          variant: plan.name === 'Pro' ? 'primary' : 'outline-primary',
          popular: plan.name === 'Pro',
        }));

        setPlans(formattedPlans);
      } catch (error) {
        console.error('Error fetching plans:', error);
      }
    };

    fetchPlans();
  }, []);

  const handlePlanSelect = asyncHandler(async (planName) => {
    try {
      const tenant_id = localStorage.getItem('tenantId');
      const status = "pending";
      
      if (!selectedPlan) {
        messageHandler('error', 'Please select a plan first.');
        return;
      }
      const response = await axios.post('/subscriptions', {
        tenant_id,
        plan_id: selectedPlan,
        planName,
        status
      });

      messageHandler(response.data.success, planName ,"successfuly activated! ");
      navigate('/companyDetails');

    } catch (error) {
      const errors = error.response?.data?.errors;
      const firstError = errors && Object.values(errors)[0]?.[0];
      messageHandler('error', firstError || 'Something went wrong.');
    }
  });

  return (
    <section className="form-wrapper">
      <div className="form-box">
        <h2 className="text-center mb-4 form-header">Choose Your Plan</h2>

        {/* Billing Toggle */}
        <div className="d-flex justify-content-center align-items-center mb-4">
          <span className="me-2">Monthly</span>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              id="billingToggle"
              checked={billingCycle === 'annually'}
              onChange={() =>
                setBillingCycle(prev => (prev === 'monthly' ? 'annually' : 'monthly'))
              }
            />
          </div>
          <span className="ms-2">Annually <small className="text-success">(Save 20%)</small></span>
        </div>

        {/* Plans */}
        <div className="row g-4 justify-content-center">
          {plans.map(plan => (
            <div key={plan.id} className="col-md-4" onClick={() => setSelectedPlan(plan.id)}>
              <div className={`pricing-card p-4 text-center h-100 ${selectedPlan === plan.id ? 'border border-primary' : 'border'
                }`}>
                <div className="bg-light py-3 mb-3 rounded">
                  <h5>{plan.name} {plan.popular && <span className="badge bg-primary ms-2">Popular</span>}</h5>
                  <div className="fs-3 text-primary">
                    ${plan.price[billingCycle]}<span className="fs-6">/mo</span>
                  </div>
                </div>

                <ul className="list-unstyled text-start mb-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="mb-2">
                      <span className="text-primary">✔</span> {feature}
                    </li>
                  ))}
                </ul>

                <button
                  className={`btn btn-${plan.variant} w-100`}
                  onClick={() => handlePlanSelect(plan.name)}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PlanSelection;
