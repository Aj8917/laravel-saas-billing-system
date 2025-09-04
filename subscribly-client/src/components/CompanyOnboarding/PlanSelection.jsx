import { useState } from 'react';
import asyncHandler from '../../util/asyncHandler';
import messageHandler from '../../util/messageHandler';
const PlanSelection = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: {
        monthly: 0,
        annually: 0
      },
      features: [
        '7 Days Free trail',
        'Basic Analytics',
        'Email Support'
      ],
      cta: 'Start Free Trial',
      variant: 'outline-primary'
    },
    {
      id: 'pro',
      name: 'Pro',
      price: {
        monthly: 29,
        annually: 24 // discounted price per month
      },
      features: [

        'Advanced Analytics',
        'Priority Support',
        'Team Collaboration'
      ],
      cta: 'Purcahse Now !',
      variant: 'primary',
      popular: true
    },
    {
      id: 'business',
      name: 'Premimum',
      price: {
        monthly: 99,
        annually: 79
      },
      features: [
        ,
        'Custom Reports',
        'Dedicated Support',
        'Team Management'
      ],
      cta: 'Contact Sales',
      variant: 'outline-primary'
    }
  ];
  const handlePlanSelect = asyncHandler(async (planId) => {
    // You can replace this with your API logic
    messageHandler('success', `You selected the ${planId} plan (${billingCycle})`);
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
              onChange={() => setBillingCycle(prev => prev === 'monthly' ? 'annually' : 'monthly')}
            />
          </div>
          <span className="ms-2">Annually <small className="text-success">(Save 20%)</small></span>
        </div>

        {/* Plans */}
        <div className="row g-4 justify-content-center">
          {plans.map(plan => (
            <div key={plan.id} className="col-md-4">
              <div className={`pricing-card p-4 text-center h-100 ${plan.popular ? 'border border-primary' : 'border'}`}>
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
  )
}

export default PlanSelection