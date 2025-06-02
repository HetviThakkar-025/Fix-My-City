import React from "react";

export function Tabs({ activeTab, onChange, children }) {
  const tabs = React.Children.toArray(children).filter(Boolean);

  return (
    <div>
      {/* Tab Headers */}
      <div className="flex space-x-4 border-b mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.props.value}
            onClick={() => onChange(tab.props.value)}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === tab.props.value
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {tabs.map(
          (tab) =>
            activeTab === tab.props.value && (
              <div key={tab.props.value}>{tab.props.children}</div>
            )
        )}
      </div>
    </div>
  );
}

export function Tab({ children }) {
  return children;
}
