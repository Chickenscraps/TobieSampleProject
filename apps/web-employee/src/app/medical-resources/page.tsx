'use client';

import { useState } from 'react';
import { medicalPlans } from '@/data/medical-plans';
import { ScrollFadeIn } from '@/components/ScrollFadeIn';
import {
  Heart,
  Shield,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Phone,
  ArrowLeft,
  Pill,
  Activity,
  Stethoscope,
} from 'lucide-react';
import Link from 'next/link';

export default function MedicalResourcesPage() {
  const [selectedPlan, setSelectedPlan] = useState<number>(0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-tobie-700 to-tobie-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-tobie-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Benefits Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Medical Resources</h1>
          <p className="text-lg text-tobie-100 max-w-2xl">
            Compare your medical plan options, understand your coverage, and find the resources
            you need to make informed decisions about your healthcare.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        {/* Plan Selector */}
        <ScrollFadeIn>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Compare Medical Plans
            </h2>
            <div className="flex flex-wrap gap-3 mb-8">
              {medicalPlans.map((plan, index) => (
                <button
                  key={plan.name}
                  onClick={() => setSelectedPlan(index)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${
                    selectedPlan === index
                      ? 'bg-tobie-600 text-white shadow-md'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-tobie-300 hover:text-tobie-600'
                  }`}
                >
                  {plan.name}
                </button>
              ))}
            </div>

            {/* Selected Plan Details */}
            {medicalPlans[selectedPlan] && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-tobie-50 p-6 border-b border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-tobie-100 rounded-lg">
                      <Heart className="w-6 h-6 text-tobie-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {medicalPlans[selectedPlan].name}
                      </h3>
                      <p className="text-gray-600 mt-1">
                        {medicalPlans[selectedPlan].description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Highlights */}
                <div className="p-6 border-b border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-3">Plan Highlights</h4>
                  <ul className="space-y-2">
                    {medicalPlans[selectedPlan].highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tier Comparison Table */}
                <div className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Coverage by Network Tier</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">
                            Feature
                          </th>
                          {medicalPlans[selectedPlan].tiers.map((tier) => (
                            <th
                              key={tier.name}
                              className="text-left py-3 px-4 font-semibold text-gray-700"
                            >
                              {tier.name}
                              <span className="block text-xs font-normal text-gray-500">
                                Tier {tier.tierNumber}
                              </span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-700">
                            Deductible (Individual)
                          </td>
                          {medicalPlans[selectedPlan].tiers.map((tier) => (
                            <td key={tier.name} className="py-3 px-4 text-gray-900 font-semibold">
                              {tier.deductible.individual}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-700">
                            Deductible (Family)
                          </td>
                          {medicalPlans[selectedPlan].tiers.map((tier) => (
                            <td key={tier.name} className="py-3 px-4 text-gray-900">
                              {tier.deductible.family}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100 bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-700">
                            OOP Max (Individual)
                          </td>
                          {medicalPlans[selectedPlan].tiers.map((tier) => (
                            <td key={tier.name} className="py-3 px-4 text-gray-900 font-semibold">
                              {tier.oopMax.individual}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b border-gray-100">
                          <td className="py-3 px-4 font-medium text-gray-700">
                            OOP Max (Family)
                          </td>
                          {medicalPlans[selectedPlan].tiers.map((tier) => (
                            <td key={tier.name} className="py-3 px-4 text-gray-900">
                              {tier.oopMax.family}
                            </td>
                          ))}
                        </tr>
                        {medicalPlans[selectedPlan].tiers[0]?.services.map((service, i) => (
                          <tr
                            key={service.service}
                            className={`border-b border-gray-100 ${i % 2 === 0 ? 'bg-gray-50' : ''}`}
                          >
                            <td className="py-3 px-4 font-medium text-gray-700">
                              {service.service}
                            </td>
                            {medicalPlans[selectedPlan].tiers.map((tier) => (
                              <td key={tier.name} className="py-3 px-4 text-gray-700">
                                {tier.services[i]?.cost || 'N/A'}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {medicalPlans[selectedPlan].premiumNote && (
                  <div className="px-6 pb-6">
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-amber-800">
                        {medicalPlans[selectedPlan].premiumNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </section>
        </ScrollFadeIn>

        {/* Key Terms */}
        <ScrollFadeIn>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Terms to Know</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  term: 'Premium',
                  definition: 'The amount you pay per paycheck for benefits coverage.',
                  icon: DollarSign,
                },
                {
                  term: 'Deductible',
                  definition:
                    'The amount you must pay out of pocket before your plan starts paying a percentage of your expenses.',
                  icon: Shield,
                },
                {
                  term: 'Coinsurance',
                  definition:
                    'The percentage you pay for covered expenses after meeting your deductible. The plan pays the rest.',
                  icon: Activity,
                },
                {
                  term: 'Copay',
                  definition:
                    'A fixed dollar amount you pay for services like doctor visits, instead of a deductible or coinsurance percentage.',
                  icon: Stethoscope,
                },
                {
                  term: 'Out-of-Pocket Maximum',
                  definition:
                    'The most you pay for covered expenses in a plan year. After reaching this, the plan pays 100%.',
                  icon: Shield,
                },
                {
                  term: 'HSA (Health Savings Account)',
                  definition:
                    'A tax-free savings account for HDHP enrollees, funded by you and Tobie, to pay for eligible medical expenses.',
                  icon: DollarSign,
                },
                {
                  term: 'HRA (Health Reimbursement Account)',
                  definition:
                    'An employer-funded account that helps offset out-of-pocket costs. Funds are applied automatically when claims are processed.',
                  icon: DollarSign,
                },
                {
                  term: 'Networks / Tiers',
                  definition:
                    'Each provider falls under a category or tier that determines how much you and the plan each pay for services.',
                  icon: Heart,
                },
              ].map((item) => (
                <div
                  key={item.term}
                  className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <item.icon className="w-5 h-5 text-tobie-500" />
                    <h3 className="font-semibold text-gray-900">{item.term}</h3>
                  </div>
                  <p className="text-sm text-gray-600">{item.definition}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollFadeIn>

        {/* Pharmacy */}
        <ScrollFadeIn>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <div className="flex items-center gap-3">
                <Pill className="w-7 h-7 text-tobie-500" />
                Prescription Drug Coverage
              </div>
            </h2>
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-gray-700 mb-4">
                All four medical plans include prescription drug coverage through{' '}
                <strong>Capital Rx</strong>. Your pharmacy benefits are managed separately from
                your medical benefits, with their own out-of-pocket maximums.
              </p>
              <div className="bg-tobie-50 rounded-lg p-4">
                <p className="text-sm text-tobie-800">
                  <strong>Rx Out-of-Pocket Maximum:</strong> $1,600 Employee Only / $3,200 Family
                  (applicable to Tobie Premier, Blue Standard, and Blue Premium plans)
                </p>
              </div>
            </div>
          </section>
        </ScrollFadeIn>

        {/* Important Notes */}
        <ScrollFadeIn>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Important Notes</h2>
            <div className="space-y-4">
              {[
                'Copays do not apply to the deductible. Out-of-pocket expenses cross-accumulate across tiers.',
                'Out-of-pocket maximums include your deductible, coinsurance, and copays. Medical and pharmacy have separate OOP limits.',
                'In-network and out-of-network coinsurance amounts are after the calendar year deductible, except where noted.',
                'Tobie completes network reviews regularly. Confirm your provider\'s current tier before seeking care.',
                'For true emergencies, ER provider fees are covered at Tier 1 benefit level regardless of facility. Other facility fees are subject to the applicable tier.',
              ].map((note, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 bg-white rounded-lg border border-gray-200 p-4"
                >
                  <AlertCircle className="w-5 h-5 text-tobie-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{note}</p>
                </div>
              ))}
            </div>
          </section>
        </ScrollFadeIn>

        {/* Contact */}
        <ScrollFadeIn>
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Need Help with Medical Benefits?
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-tobie-500" />
                  <h3 className="font-semibold text-gray-900">Benefits Support</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  For benefits questions and enrollment assistance
                </p>
                <p className="text-tobie-600 font-semibold">800-890-5420</p>
                <p className="text-sm text-gray-500 mt-1">
                  Or submit an inquiry via ServiceNow
                </p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Phone className="w-5 h-5 text-tobie-500" />
                  <h3 className="font-semibold text-gray-900">IT Service Desk</h3>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  For Infor access and enrollment platform tech support
                </p>
                <p className="text-tobie-600 font-semibold">866-966-8268</p>
                <p className="text-sm text-gray-500 mt-1">
                  Help with Microsoft Authenticator and system access
                </p>
              </div>
            </div>
          </section>
        </ScrollFadeIn>
      </div>
    </div>
  );
}
