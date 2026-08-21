"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&display=swap');

  .mb-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
    height: 62px;
    background: rgba(7,9,15,0.92);
    backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba(255,255,255,0.08);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px;
    font-family: 'Syne', sans-serif;
  }

  .mb-brand { display:flex; align-items:center; gap:10px; text-decoration:none; }
  .mb-brand-ico {
    width:32px; height:32px; border-radius:8px;
    background:linear-gradient(135deg,#00D4FF,#00E5A8);
    display:flex; align-items:center; justify-content:center;
    font-size:18px; box-shadow:0 0 15px rgba(0,212,255,0.2);
  }
  .mb-brand-txt {
    font-weight:700; font-size:17px;
    background:linear-gradient(135deg,#fff,#00D4FF);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
  }

  .mb-links {
    display:flex; align-items:center; gap:4px;
    position:absolute; left:50%; transform:translateX(-50%);
  }
  .mb-link {
    text-decoration:none; color:#7A7F99; font-size:13.5px; font-weight:500;
    padding:6px 14px; border-radius:8px; transition:all 0.2s;
  }
  .mb-link:hover { color:#fff; background:rgba(255,255,255,0.05); }
  .mb-link.active { color:#fff; background:rgba(255,255,255,0.1); }

  .mb-auth { display:flex; align-items:center; gap:12px; }

  .mb-btn-login {
    text-decoration:none; color:#7A7F99; font-size:13.5px;
    padding:8px 16px; transition:color 0.2s;
  }
  .mb-btn-login:hover { color:#fff; }

  .mb-btn-signup {
    text-decoration:none; font-size:13.5px; font-weight:700; color:#060A12;
    background:linear-gradient(135deg,#00D4FF,#00E5A8);
    padding:8px 20px; border-radius:8px; transition:all 0.2s;
  }
  .mb-btn-signup:hover { box-shadow:0 0 20px rgba(0,212,255,0.4); transform:translateY(-1px); }

  .mb-profile-wrap { position:relative; }
  .mb-profile {
    display:flex; align-items:center; gap:8px; cursor:pointer;
    background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
    padding:6px 12px; border-radius:50px; transition:all 0.2s;
  }
  .mb-profile:hover { background:rgba(255,255,255,0.08); border-color:rgba(255,255,255,0.2); }

  .mb-avatar {
    width:26px; height:26px; border-radius:50%;
    background:#0B0E18; border:1.5px solid rgba(0,212,255,0.5);
    display:flex; align-items:center; justify-content:center;
    font-size:12px; font-weight:700; color:#00D4FF;
  }
  .mb-username {
    font-size:13px; font-weight:600; color:#fff;
    text-transform:uppercase; letter-spacing:0.05em;
    max-width:140px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }

  .mb-dropdown {
    position:absolute; top:calc(100% + 8px); right:0;
    width:200px; background:#0B0E18;
    border:1px solid rgba(255,255,255,0.1);
    border-radius:12px; padding:6px 0;
    box-shadow:0 10px 40px rgba(0,0,0,0.6);
    opacity:0; pointer-events:none; transform:translateY(-8px);
    transition:all 0.2s ease;
  }
  .mb-profile-wrap:hover .mb-dropdown {
    opacity:1; pointer-events:auto; transform:translateY(0);
  }
  .mb-dd-header {
    padding:10px 16px;
    border-bottom:1px solid rgba(255,255,255,0.06);
    margin-bottom:4px;
  }
  .mb-dd-name  { font-size:13px; font-weight:700; color:#fff; margin-bottom:2px; }
  .mb-dd-role  { font-size:10px; color:#4A6080; letter-spacing:0.08em; text-transform:uppercase; }

  .mb-dd-item {
    display:flex; align-items:center; gap:9px; padding:10px 16px;
    text-decoration:none; color:#7A7F99; font-size:13px;
    background:transparent; border:none; width:100%; text-align:left;
    cursor:pointer; font-family:'Syne',sans-serif; transition:all 0.15s;
  }
  .mb-dd-item:hover { color:#fff; background:rgba(255,255,255,0.05); }
  .mb-dd-item.danger:hover { color:#FF5E8A; background:rgba(255,94,138,0.08); }
  .mb-dd-divider { height:1px; background:rgba(255,255,255,0.05); margin:4px 0; }

  .mb-skeleton {
    width:110px; height:34px; border-radius:20px;
    background:rgba(255,255,255,0.05);
    animation:skShimmer 1.5s ease-in-out infinite;
  }
  @keyframes skShimmer {
    0%,100% { opacity:0.4; }
    50%      { opacity:0.9; }
  }
`;

const NAV_LINKS = [
  { name:"Mentors",      href:"/mentors"        },
  { name:"Scholarships", href:"/scholarships"   },
  { name:"Stories",      href:"/stories"        },
  { name:"Career Paths", href:"/career-paths"   },
  { name:"Market Data",  href:"/market-insights"},
  { name:"ROI Matrix",   href:"/roi-matrix"     },
];

export default function Navbar() {
  const { user, loading, setUser } = useAuth();
  const pathname = usePathname();
  const router   = useRouter();

  async function handleSignOut() {
    try { await fetch("/api/auth/logout", { method: "POST" }); } catch {}
    setUser(null);
    router.push("/");
  }

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <nav className="mb-nav">

        {/* BRAND */}
        <Link href="/" className="mb-brand">
          <div className="mb-brand-ico">🧭</div>
          <span className="mb-brand-txt">MentorBridge</span>
        </Link>

        {/* CENTER LINKS */}
        <div className="mb-links">
          {NAV_LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className={`mb-link${pathname === l.href ? " active" : ""}`}
            >
              {l.name}
            </Link>
          ))}
        </div>

        {/* RIGHT: STRICT 3-STATE TOGGLE */}
        <div className="mb-auth">

          {/* STATE 1 — loading: show skeleton, nothing else */}
          {loading && <div className="mb-skeleton" />}

          {/* STATE 2 — logged IN: profile pill + dropdown */}
          {!loading && user && (
            <div className="mb-profile-wrap">
              <div className="mb-profile">
                <div className="mb-avatar">{initial}</div>
                <span className="mb-username">{user.name}</span>
                <span style={{ color:"#4A6080", fontSize:10 }}>▼</span>
              </div>

              <div className="mb-dropdown">
                <div className="mb-dd-header">
                  <div className="mb-dd-name">{user.name}</div>
                  <div className="mb-dd-role">{user.role}</div>
                </div>
                
                {/* 🎛️ NEW DASHBOARD LINK ADDED HERE */}
                <Link 
                  href={user.role === "mentor" ? "/dashboard/mentor" : "/dashboard/student"} 
                  className="mb-dd-item"
                >
                  🎛️ My Dashboard
                </Link>

                <Link href="/mentors" className="mb-dd-item">
                  🔍 Browse Mentors
                </Link>
                <Link href="/dashboard/student" className="mb-dd-item">
                  🗺️ Roadmaps
                </Link>
                <div className="mb-dd-divider" />
                <button onClick={handleSignOut} className="mb-dd-item danger">
                  🚪 Sign Out
                </button>
              </div>
            </div>
          )}

          {/* STATE 3 — logged OUT: login + signup buttons */}
          {!loading && !user && (
            <>
              <Link href="/login"  className="mb-btn-login">Log in</Link>
              <Link href="/signup" className="mb-btn-signup">Sign up →</Link>
            </>
          )}

        </div>
      </nav>
    </>
  );
}