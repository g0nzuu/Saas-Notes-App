import React, {useState, useEffect} from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import NoteCard from './components/NoteCard';
import NoteModal from './components/NoteModal';
import UpgradeBanner from './components/UpgradeBanner';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function App(){
  const [token, setToken] = useState(localStorage.getItem('token')||'');
  const [email, setEmail] = useState('admin@acme.test');
  const [password, setPassword] = useState('password');
  const [notes, setNotes] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [role, setRole] = useState(null);
  const [message, setMessage] = useState('');
  const [reachedLimit, setReachedLimit] = useState(false);
  const [isFree, setIsFree] = useState(true);
  const [emailStored, setEmailStored] = useState('');

  useEffect(()=>{ if(token) fetchNotes(); }, [token]);

  const login = async () => {
    try{
      const res = await axios.post(API_BASE + '/auth/login', { email, password });
      if (!res.data.success) return setMessage(res.data.message || 'Login failed');
      const d = res.data.data;
      setToken(d.token);
      localStorage.setItem('token', d.token);
      setTenant(d.tenant);
      setRole(d.role);
      setEmailStored(d.email);
      setMessage('Logged in');
    }catch(e){ setMessage('Login failed'); }
  };

  const fetchNotes = async () => {
    try{
      const res = await axios.get(API_BASE + '/notes', { headers: { Authorization: 'Bearer ' + token }});
      if (!res.data.success) return setMessage(res.data.message || 'Could not fetch notes');
      setNotes(res.data.data);
      setMessage('');
      // check plan
      const t = await axios.get(API_BASE + '/auth/me', { headers: { Authorization: 'Bearer ' + token }}).catch(()=>null);
      if (t && t.data && t.data.success) {
        setIsFree(t.data.data.tenant.plan === 'free');
      }
      // reached limit?
      setReachedLimit(res.data.data.length >= 3);
    }catch(e){ console.error(e); setMessage('Could not fetch notes'); }
  };

  const createNote = async (payload) => {
    try{
      const res = await axios.post(API_BASE + '/notes', payload, { headers: { Authorization: 'Bearer ' + token }});
      if (!res.data.success) return setMessage(res.data.message || 'Create failed');
      setNotes([res.data.data, ...notes]);
      setModalOpen(false);
      setMessage('Note created');
      setReachedLimit(notes.length+1 >= 3);
    }catch(e){ setMessage(e.response?.data?.message || 'Create failed'); }
  };

  const updateNote = async (id, payload) => {
    try{
      const res = await axios.put(API_BASE + '/notes/' + id, payload, { headers: { Authorization: 'Bearer ' + token }});
      if (!res.data.success) return setMessage(res.data.message || 'Update failed');
      setNotes(notes.map(n => n._id === id ? res.data.data : n));
      setModalOpen(false);
      setEditing(null);
      setMessage('Note updated');
    }catch(e){ setMessage(e.response?.data?.message || 'Update failed'); }
  };

  const deleteNote = async (id) => {
    try{
      const res = await axios.delete(API_BASE + '/notes/' + id, { headers: { Authorization: 'Bearer ' + token }});
      if (!res.data.success) return setMessage(res.data.message || 'Delete failed');
      setNotes(notes.filter(n => n._id !== id));
      setMessage('Deleted');
      setReachedLimit(notes.length-1 >= 3);
    }catch(e){ setMessage('Delete failed'); }
  };

  const onSave = (payload) => {
    if (editing) return updateNote(editing._id, payload);
    return createNote(payload);
  };

  const openCreate = ()=> { setEditing(null); setModalOpen(true); };
  const openEdit = (note) => { setEditing(note); setModalOpen(true); };

  const upgrade = async () => {
    if (!tenant) return setMessage('No tenant');
    try{
      const res = await axios.post(API_BASE + '/tenants/' + tenant.slug + '/upgrade', {}, { headers: { Authorization: 'Bearer ' + token }});
      if (!res.data.success) return setMessage(res.data.message || 'Upgrade failed');
      setIsFree(false);
      setMessage('Upgraded to Pro');
    }catch(e){ setMessage(e.response?.data?.message || 'Upgrade failed'); }
  };

  const logout = ()=>{ setToken(''); localStorage.removeItem('token'); setNotes([]); setTenant(null); setRole(null); setEmailStored(''); setMessage('Logged out'); };

  // fetch /auth/me endpoint - implement fallback if not available
  useEffect(()=> {
    if (!token) return;
    axios.get(API_BASE + '/auth/me', { headers: { Authorization: 'Bearer ' + token }})
      .then(res=> {
        if (res.data.success) {
          setTenant(res.data.data.tenant);
          setRole(res.data.data.role);
          setEmailStored(res.data.data.email);
          setIsFree(res.data.data.tenant.plan === 'free');
        }
      }).catch(()=>{});
  }, [token]);

  return (
    <div>
      <Navbar tenant={tenant} role={role} email={emailStored} onLogout={logout} />
      <div className="container mt-6">
        {!token ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
            <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
            <input className="w-full border px-3 py-2 rounded mb-3" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" />
            <input className="w-full border px-3 py-2 rounded mb-3" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" />
            <button onClick={login} className="w-full bg-indigo-600 text-white py-2 rounded">Login</button>
            <p className="text-sm text-gray-500 mt-3">Demo accounts: admin@acme.test, user@acme.test, admin@globex.test, user@globex.test (password)</p>
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">Notes</h2>
                <p className="text-sm text-gray-500">{tenant?.name} — {role}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button onClick={openCreate} className="bg-indigo-600 text-white px-4 py-2 rounded">+ Create Note</button>
                <button onClick={fetchNotes} className="px-3 py-2 rounded border">Refresh</button>
              </div>
            </div>

            <UpgradeBanner isFree={isFree} reachedLimit={reachedLimit} onUpgrade={upgrade} isAdmin={role==='Admin'} />

            {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {notes.map(n => (
                <NoteCard key={n._id} note={n} onEdit={(note)=>openEdit(note)} onDelete={deleteNote} />
              ))}
            </div>

            <NoteModal isOpen={modalOpen} onClose={()=>{setModalOpen(false); setEditing(null);}} onSave={onSave} initial={editing} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
