import { useEffect, useState } from "react";
import { Lock, Bell, Cpu, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  getSettings,
  updateSettings,
  changePassword,
} from "../services/settingsService";

export default function Settings() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    email: false,
    interview: true,
    weekly: true,
    updates: false,
  });

  const [aiStyle, setAiStyle] = useState("Balanced");
  const [aiTone, setAiTone] = useState("Professional");

  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Settings state
  const [settingsLoading, setSettingsLoading] = useState(true);

  // Load saved settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();

        setNotifications({
          email: data.emailNotifications,
          interview: data.interviewReminders,
          weekly: data.weeklySummary,
          updates: data.productUpdates,
        });

        setAiStyle(data.aiResponseStyle);
        setAiTone(data.aiCommunicationTone);
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setSettingsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save notification + AI settings
  const saveSettings = async (
    updatedNotifications,
    updatedAiStyle,
    updatedAiTone
  ) => {
    try {
      await updateSettings({
        emailNotifications: updatedNotifications.email,
        interviewReminders: updatedNotifications.interview,
        weeklySummary: updatedNotifications.weekly,
        productUpdates: updatedNotifications.updates,
        aiResponseStyle: updatedAiStyle,
        aiCommunicationTone: updatedAiTone,
      });
    } catch (error) {
      console.error("Failed to update settings:", error);
    }
  };

  // Notification toggle
  const handleNotificationChange = (key, value) => {
    const updatedNotifications = {
      ...notifications,
      [key]: value,
    };

    setNotifications(updatedNotifications);

    saveSettings(
      updatedNotifications,
      aiStyle,
      aiTone
    );
  };

  // AI response style
  const handleAiStyleChange = (value) => {
    setAiStyle(value);

    saveSettings(
      notifications,
      value,
      aiTone
    );
  };

  // AI communication tone
  const handleAiToneChange = (value) => {
    setAiTone(value);

    saveSettings(
      notifications,
      aiStyle,
      value
    );
  };

  // Change password
  const handlePasswordUpdate = async () => {
    setPasswordMessage("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordMessage("⚠ Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        "❌ New password and Confirm password must match."
      );
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        "❌ New password must be at least 6 characters."
      );
      return;
    }

    try {
      setPasswordLoading(true);

      await changePassword(currentPassword, newPassword);

      setPasswordMessage("✅ Password updated successfully.");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Failed to change password:", error);

      setPasswordMessage(
        `❌ ${error.message || "Failed to update password."}`
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-8">
      {/* Hero Section */}
      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 px-8 py-6 shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-4xl font-bold text-white lg:text-5xl">
              ⚙ Settings
            </h1>

            <p className="mt-4 max-w-2xl text-lg text-blue-100">
              Manage account security, notifications, and personalize your
              AI experience.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <Card
        icon={<Lock size={20} />}
        color="bg-red-100"
        title="Change Password"
        desc="Update your password to keep your account secure."
      >
        <div className="space-y-5">
          <Input
            label="Current Password"
            type="password"
            placeholder="Enter your current password"
            value={currentPassword}
            onChange={setCurrentPassword}
          />

          <Input
            label="New Password"
            type="password"
            placeholder="Create a new password"
            value={newPassword}
            onChange={setNewPassword}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your new password"
            value={confirmPassword}
            onChange={setConfirmPassword}
          />

          <button
            onClick={handlePasswordUpdate}
            disabled={passwordLoading}
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {passwordLoading ? "Updating..." : "Update Password"}
          </button>

          {passwordMessage && (
            <p className="text-sm font-medium text-gray-600">
              {passwordMessage}
            </p>
          )}
        </div>
      </Card>

      {/* Notifications */}
      <Card
        icon={<Bell size={20} />}
        color="bg-amber-100"
        title="Notifications"
        desc="Control how and when you receive updates."
      >
        {settingsLoading ? (
          <p className="text-sm text-gray-500">
            Loading notification preferences...
          </p>
        ) : (
          <div className="space-y-2">
            <Toggle
              label="Email Updates"
              enabled={notifications.email}
              onChange={(val) =>
                handleNotificationChange("email", val)
              }
            />

            <Toggle
              label="Interview Reminders"
              enabled={notifications.interview}
              onChange={(val) =>
                handleNotificationChange("interview", val)
              }
            />

            <Toggle
              label="Weekly Summary"
              enabled={notifications.weekly}
              onChange={(val) =>
                handleNotificationChange("weekly", val)
              }
            />

            <Toggle
              label="Product Updates"
              enabled={notifications.updates}
              onChange={(val) =>
                handleNotificationChange("updates", val)
              }
            />
          </div>
        )}
      </Card>

      {/* AI Preferences */}
      <Card
        icon={<Cpu size={20} />}
        color="bg-purple-100"
        title="AI Preferences"
        desc="Personalize how the AI assistant responds."
      >
        {settingsLoading ? (
          <p className="text-sm text-gray-500">
            Loading AI preferences...
          </p>
        ) : (
          <div className="space-y-6">
            <Pills
              label="AI Response Style"
              options={["Short", "Balanced", "Detailed"]}
              selected={aiStyle}
              onSelect={handleAiStyleChange}
            />

            <Pills
              label="Communication Tone"
              options={[
                "Professional",
                "Friendly",
                "Formal",
                "Creative",
              ]}
              selected={aiTone}
              onSelect={handleAiToneChange}
            />
          </div>
        )}
      </Card>

      {/* Help & Support */}
      <Card
        icon={<HelpCircle size={20} />}
        color="bg-green-100"
        title="Help & Support"
        desc="Find answers or get in touch with our support team."
      >
        <div className="divide-y divide-gray-100">
          {[
            { icon: "❓", label: "Help Center" },
            { icon: "💬", label: "Contact Support" },
            { icon: "🐞", label: "Report a Bug" },
            { icon: "💡", label: "Send Feedback" },
            { icon: "ℹ️", label: "About JobTrack AI" },
          ].map((item) => (
            <div
              key={item.label}
              onClick={() => {
                if (item.label === "Help Center") {
                  navigate("/help-center");
                }

                if (item.label === "Contact Support") {
                  navigate("/contact-support");
                }

                if (item.label === "Report a Bug") {
                  navigate("/report-bug");
                }

                if (item.label === "Send Feedback") {
                  navigate("/send-feedback");
                }

                if (item.label === "About JobTrack AI") {
                  navigate("/about-jobtrack");
                }
              }}
              className="flex cursor-pointer items-center justify-between py-4 transition hover:text-blue-600"
            >
              <div className="flex items-center gap-3">
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </div>

              <span className="text-gray-400">›</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Card({ icon, color, title, desc, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="mb-5 flex items-start gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${color}`}
        >
          {icon}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            {title}
          </h2>

          {desc && (
            <p className="mt-1 text-sm text-gray-500">{desc}</p>
          )}
        </div>
      </div>

      {children}
    </div>
  );
}

function Input({ label, type, placeholder, value, onChange }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-300 bg-slate-50 px-4 py-3 outline-none transition-all duration-200 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
      />
    </div>
  );
}

function Toggle({ label, enabled, onChange }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-transparent px-2 py-3 transition hover:bg-gray-50">
      <span className="font-medium text-gray-700">{label}</span>

      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`flex h-7 w-14 items-center rounded-full p-1 transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`h-5 w-5 rounded-full bg-white shadow transition ${
            enabled ? "translate-x-7" : ""
          }`}
        />
      </button>
    </div>
  );
}

function Pills({ label, options, selected, onSelect }) {
  return (
    <div>
      <p className="mb-3 text-sm font-medium text-gray-700">
        {label}
      </p>

      <div className="flex flex-wrap gap-3">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onSelect(option)}
            className={`rounded-full border px-5 py-2 text-sm font-medium transition ${
              selected === option
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}