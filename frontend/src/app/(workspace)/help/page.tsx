"use client";

export default function HelpPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Help & Support
        </h1>
        <p className="text-gray-600">Get help with using the platform</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">
                  How do I create a new task?
                </h4>
                <p className="text-sm text-gray-600">
                  Navigate to the Tasks page and click the "Create Task" button.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">
                  How do I add a new worker?
                </h4>
                <p className="text-sm text-gray-600">
                  Go to the Workers page and click "Add Worker".
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-1">
                  How do I update field information?
                </h4>
                <p className="text-sm text-gray-600">
                  Visit the Fields page, select a field, and click "Edit".
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Contact Support
            </h3>
            <p className="text-gray-600">
              Need more help? Contact us at support@farmhub.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}