import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Manage your Cabana account settings and preferences',
};

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl sm:text-4xl font-bold">Settings</h1>
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Notification Preferences</h2>
        <div className="flex items-center justify-between">
          <span>Email Notifications</span>
          <input type="checkbox" defaultChecked className="toggle-checkbox" />
        </div>
        <div className="flex items-center justify-between">
          <span>SMS Notifications</span>
          <input type="checkbox" className="toggle-checkbox" />
        </div>
      </div>
      <div className="glass p-6 space-y-4">
        <h2 className="text-xl font-semibold">Security</h2>
        <div>
          <label htmlFor="password" className="block text-sm mb-1">Change Password</label>
          <input id="password" type="password" placeholder="New password" className="w-full glass px-3 py-2" />
        </div>
        <button className="btn btn-secondary">Update Password</button>
      </div>
    </div>
  );
}