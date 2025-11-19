@component('mail::message')
# 🎉 Welcome to Premium, {{ $user->name }}!

Thank you for upgrading to the **Premimum Plan**.  
Your premium access has now been activated successfully.

@component('mail::panel')
You now have access to all premium features, priority support, enhanced analytics, and advanced tools designed to help you scale faster.
@endcomponent

### 🔥 What’s Included in Your Premium Plan:
- Unlimited access to premium features  
- Advanced analytics & reports  
- Priority customer support  
- Faster processing & higher limits  
- Access to exclusive updates and beta features  

@component('mail::button', ['url' => url('/')])
Go to Dashboard
@endcomponent

If you ever need help, our support team is always here for you.

Thanks,  
**{{ config('app.name') }} Team**

@endcomponent
