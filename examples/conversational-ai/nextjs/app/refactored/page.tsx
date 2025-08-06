import { RefactoredConversationalAI } from "@/components/refactored/RefactoredConversationalAI";

export default function RefactoredPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-8">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Hero Section */}
                <div className="text-center space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        🏗️ Refactored Architecture
                    </div>
                    
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Clean Code Architecture
                    </h1>
                    
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience the same functionality with improved code quality following SOLID principles, 
                        enhanced maintainability, and better separation of concerns.
                    </p>

                    {/* Architecture Highlights */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-3xl mb-3">🎯</div>
                            <div className="font-semibold text-lg mb-2">SOLID Principles</div>
                            <div className="text-sm text-gray-600">
                                Single Responsibility, Open/Closed, Liskov Substitution, 
                                Interface Segregation, Dependency Inversion
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-3xl mb-3">🧩</div>
                            <div className="font-semibold text-lg mb-2">Modular Design</div>
                            <div className="text-sm text-gray-600">
                                Separated concerns with custom hooks, services, 
                                utilities, and focused components
                            </div>
                        </div>
                        
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <div className="text-3xl mb-3">🔬</div>
                            <div className="font-semibold text-lg mb-2">Testable Code</div>
                            <div className="text-sm text-gray-600">
                                Pure functions, dependency injection, 
                                and separated business logic for easy testing
                            </div>
                        </div>
                    </div>
                </div>

                {/* Code Quality Improvements */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-center">Code Quality Improvements</h2>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-green-700">✅ After Refactoring</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <div>
                                        <strong>Separated Concerns:</strong> Business logic, UI logic, and API calls in different layers
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <div>
                                        <strong>Custom Hooks:</strong> Reusable state management and side effects
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <div>
                                        <strong>Service Layer:</strong> Centralized API operations with error handling
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <div>
                                        <strong>Type Safety:</strong> Comprehensive TypeScript types and interfaces
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-500 font-bold">✓</span>
                                    <div>
                                        <strong>Atomic Components:</strong> Small, focused, reusable UI components
                                    </div>
                                </li>
                            </ul>
                        </div>
                        
                        <div>
                            <h3 className="text-lg font-semibold mb-4 text-red-700">❌ Before Refactoring</h3>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✗</span>
                                    <div>
                                        <strong>Monolithic Components:</strong> Large components with multiple responsibilities
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✗</span>
                                    <div>
                                        <strong>Mixed Concerns:</strong> API calls, state management, and UI in same file
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✗</span>
                                    <div>
                                        <strong>Duplicated Logic:</strong> Similar code repeated across components
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✗</span>
                                    <div>
                                        <strong>Hard to Test:</strong> Tightly coupled code with side effects
                                    </div>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-500 font-bold">✗</span>
                                    <div>
                                        <strong>Poor Reusability:</strong> Components tied to specific use cases
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Refactored Demo */}
                <RefactoredConversationalAI />

                {/* Architecture Diagram */}
                <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-bold mb-6 text-center">New Architecture Overview</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <div className="font-semibold text-blue-800 mb-2">Presentation Layer</div>
                            <div className="text-xs text-blue-600">
                                • React Components<br/>
                                • UI Logic<br/>
                                • Event Handling
                            </div>
                        </div>
                        
                        <div className="bg-green-50 p-4 rounded-lg">
                            <div className="font-semibold text-green-800 mb-2">Business Logic</div>
                            <div className="text-xs text-green-600">
                                • Custom Hooks<br/>
                                • State Management<br/>
                                • Side Effects
                            </div>
                        </div>
                        
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <div className="font-semibold text-purple-800 mb-2">Service Layer</div>
                            <div className="text-xs text-purple-600">
                                • API Calls<br/>
                                • Data Transformation<br/>
                                • Error Handling
                            </div>
                        </div>
                        
                        <div className="bg-orange-50 p-4 rounded-lg">
                            <div className="font-semibold text-orange-800 mb-2">Utilities & Types</div>
                            <div className="text-xs text-orange-600">
                                • Type Definitions<br/>
                                • Helper Functions<br/>
                                • Constants
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
