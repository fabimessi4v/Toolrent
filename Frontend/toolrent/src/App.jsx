import React, { useState } from 'react';
import Login from './components/Login.jsx';
import CustomerList from './components/CustomerList.jsx';

function App() {
  const [user, setUser] = useState(null);
  const [showCustomers, setShowCustomers] = useState(false);

  const toggleCustomerList = () => {
    setShowCustomers(prevShow => !prevShow);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold">Toolrent</h1>
        <p className="text-muted-foreground">App de Arriendo de Herramientas</p>
      </header>

      <main className="w-full flex flex-col items-center">
        {!user ? (
          <Login onLogin={setUser} />
        ) : (
          <>
            <p className="mb-4">Bienvenido, {user}</p>
            <div className="mb-4">
              <button
                onClick={toggleCustomerList}
                className="bg-slate-900 text-white hover:bg-slate-800 font-medium rounded-lg text-sm px-5 py-2.5"
              >
                {showCustomers ? 'Ocultar Usuarios' : 'Ver Usuarios'}
              </button>
            </div>
            {showCustomers && (
              <div className="w-full flex justify-center">
                <CustomerList />
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;

