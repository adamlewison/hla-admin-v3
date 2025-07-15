export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-hla-black">HLA Admin Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Tailwind CSS Test Page</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-hla-black mb-4">
            Tailwind CSS Test Page
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            This page demonstrates various Tailwind CSS features to verify everything is working correctly.
          </p>
        </div>

        {/* Color Palette Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-hla-black mb-6">Color Palette Test</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-hla-black text-white p-4 rounded-lg text-center">
              <div className="font-bold">HLA Black</div>
              <div className="text-sm opacity-80">#000000</div>
            </div>
            <div className="bg-hla-green text-white p-4 rounded-lg text-center">
              <div className="font-bold">HLA Green</div>
              <div className="text-sm opacity-80">#2D5A3D</div>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg text-center">
              <div className="font-bold">Blue 500</div>
              <div className="text-sm opacity-80">Default</div>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg text-center">
              <div className="font-bold">Red 500</div>
              <div className="text-sm opacity-80">Default</div>
            </div>
            <div className="bg-yellow-500 text-white p-4 rounded-lg text-center">
              <div className="font-bold">Yellow 500</div>
              <div className="text-sm opacity-80">Default</div>
            </div>
            <div className="bg-purple-500 text-white p-4 rounded-lg text-center">
              <div className="font-bold">Purple 500</div>
              <div className="text-sm opacity-80">Default</div>
            </div>
          </div>
        </section>

        {/* Typography Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-hla-black mb-6">Typography Test</h3>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-hla-black">Heading 1 - 4xl Bold</h1>
            <h2 className="text-3xl font-semibold text-hla-black">Heading 2 - 3xl Semibold</h2>
            <h3 className="text-2xl font-medium text-hla-black">Heading 3 - 2xl Medium</h3>
            <h4 className="text-xl font-normal text-hla-black">Heading 4 - xl Normal</h4>
            <p className="text-lg text-gray-700">Paragraph - lg Regular text with good readability</p>
            <p className="text-base text-gray-600">Base text - Standard paragraph size</p>
            <p className="text-sm text-gray-500">Small text - For captions and metadata</p>
            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">Code snippet</code>
          </div>
        </section>

        {/* Spacing and Layout Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-hla-black mb-6">Spacing and Layout Test</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-lg font-semibold mb-3">Card 1</h4>
              <p className="text-gray-600 mb-4">This card demonstrates padding, margins, and border styling.</p>
              <button className="bg-hla-green text-white px-4 py-2 rounded hover:bg-hla-black transition-colors">
                Button
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-lg font-semibold mb-3">Card 2</h4>
              <p className="text-gray-600 mb-4">Responsive grid layout with proper spacing.</p>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                Button
              </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <h4 className="text-lg font-semibold mb-3">Card 3</h4>
              <p className="text-gray-600 mb-4">Hover effects and transitions working properly.</p>
              <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                Button
              </button>
            </div>
          </div>
        </section>

        {/* Flexbox Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-hla-black mb-6">Flexbox Test</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-hla-green rounded-full"></div>
                <span className="text-sm font-medium">Item 1</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium">Item 2</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium">Item 3</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="text-sm font-medium">Item 4</span>
              </div>
            </div>
          </div>
        </section>

        {/* Responsive Design Test */}
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-hla-black mb-6">Responsive Design Test</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm font-medium text-gray-600">Mobile</div>
                <div className="text-xs text-gray-500">1 column</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm font-medium text-gray-600">Tablet</div>
                <div className="text-xs text-gray-500">2 columns</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm font-medium text-gray-600">Desktop</div>
                <div className="text-xs text-gray-500">4 columns</div>
              </div>
              <div className="bg-gray-100 p-4 rounded text-center">
                <div className="text-sm font-medium text-gray-600">Large</div>
                <div className="text-xs text-gray-500">4 columns</div>
              </div>
            </div>
          </div>
        </section>

        {/* Status Indicator */}
        <section className="text-center">
          <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="font-medium">Tailwind CSS is working correctly!</span>
          </div>
        </section>
      </main>
    </div>
  );
}