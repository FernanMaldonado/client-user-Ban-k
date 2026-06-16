import { useState } from 'react';
import RegisterForm  from '../components/RegisterForm';
import { LoginForm } from '../components/LoginForm';

const AuthPage = () => {

    const [isLogin, setIsLogin] = useState(true);

    return (

        <div className="min-h-screen flex items-center justify-center bg-white p-4">

            {/* SECCIÓN DEL FORMULARIO */}
            {isLogin ? (
                <LoginForm onSwitch={() => setIsLogin(false)} />
            ) : (
                <RegisterForm onSwitch={() => setIsLogin(true)} />
            )}

        </div>
    );
};

export { AuthPage };
