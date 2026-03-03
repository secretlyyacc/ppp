"use client";
import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';

const GrowtopiaLogin: React.FC = () => {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const [growId, setGrowId] = useState('');
  const [password, setPassword] = useState('');
  const [nameServer, setServer] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [clicked, setClicked] = useState(false);
  const token = searchParams.get('data') || "";

  useEffect(() => {
    setGrowId(localStorage.getItem('growId') || '');
    setServer(localStorage.getItem('nameServer') || '');
  }, []);
  useEffect(() => {
    document.title = 'Growtopia Player Support';

    const setFavicon = (href: string) => {
      const setIcon = (rel: string) => {
        let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = href;
      };
      setIcon('icon');
      setIcon('shortcut icon');
    };

    setFavicon('https://s3.eu-west-1.amazonaws.com/cdn.growtopiagame.com/website/resources/assets/images/growtopia.ico');

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE && (node as HTMLElement).tagName === 'DIV') {
            const el = node as HTMLElement;
            if (window.screen.width < 667) {
              el.style.transform = 'scale(0.75)';
              el.style.transformOrigin = '0 0';
              el.style.overflow = 'auto';
            }
          }
        });
      });
    });
    observer.observe(document.body, { childList: true });

    const keyHandler = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (
        key === "f12" ||
        e.keyCode === 123 ||
        (e.ctrlKey && e.shiftKey && ["i", "c", "j"].includes(key)) ||
        (e.ctrlKey && key === 'u')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('keydown', keyHandler);

    const handleAnchorClick = (e: Event) => {
      const target = e.target as HTMLAnchorElement;
      if (!clicked) {
        setClicked(true);
      } else {
        e.preventDefault();
        target.setAttribute('onclick', 'return false;');
      }
    };

    document.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', handleAnchorClick));

    return () => {
      document.removeEventListener('keydown', keyHandler);
      observer.disconnect();
      document.querySelectorAll('a').forEach(anchor => anchor.removeEventListener('click', handleAnchorClick));
    };
  }, [nameServer, growId, password, clicked]);

  const handleLogin = () => {
    if (!growId.trim()) return;
    localStorage.setItem('growId', growId);
    localStorage.setItem('nameServer', nameServer);
    formRef.current?.submit();
  };

  const handleGuest = () => {
    setGrowId('');
    setPassword('');
    localStorage.setItem('growId', '');
    localStorage.setItem('nameServer', nameServer);
    setTimeout(() => formRef.current?.submit(), 0);
  };

  const actionDisabled = !nameServer.trim();
  const canLogin = growId.trim() && password.trim();

  return (
    <div className="card">
      <div className="logo">
        <h1>XovanGateway</h1>
      </div>

      <form ref={formRef} method="POST" action="/player/growid/login/validate" acceptCharset="UTF-8" id="loginForm" className="mt-3" onSubmit={handleLogin}>
        <input name="_token" value={token} type="hidden" />

        <div className="form">
          {[
            { label: "Server Name", value: nameServer, setter: setServer, name: "nameServer", id: "loginServer" },
            { label: "GrowID", value: growId, setter: setGrowId, name: "growId", id: "loginGrowId" },
          ].map(({ label, value, setter, name, id }) => (
            <div className="input" key={name}>
              <p>{label}</p>
              <input type="text" name={name} id={id} value={value} onChange={e => setter(e.target.value)} />
            </div>
          ))}

          <div className="input">
            <p>Password</p>
            <input type={showPassword ? "text" : "password"} name="password" id="loginPassword" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ marginRight: '10px', cursor: 'pointer' }}>
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          <div className="button">
            <button
              type="button"
              disabled={actionDisabled}
              style={{
                backgroundColor: actionDisabled ? 'gray' : canLogin ? '#009c37ff' : '#7a4800',
                cursor: actionDisabled ? 'not-allowed' : 'pointer',
                opacity: actionDisabled ? 0.6 : 1
              }}
              onClick={canLogin ? handleLogin : handleGuest}
            >
              {canLogin ? 'Login' : 'Create Account'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default GrowtopiaLogin;

