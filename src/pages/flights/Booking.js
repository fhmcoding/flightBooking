import Steps from "../../components/layouts/Steps"
import React,{useState,Fragment} from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import FlightComponent from "../../components/Flights/FlightComponent";
import NotFound from "../../components/layouts/NotFound";
import {getServicesApi,getPriceApi,bookApi} from "../../api/flights"
import { CheckCircleIcon } from '@heroicons/react/20/solid'
import {  Transition } from '@headlessui/react'

const Booking = () => {
    const { sequence_number } = useParams();
    const flights   = useSelector(state => state.flights)
    const selectedFlight = flights.find((flight) => flight.sequenceNumber == sequence_number)
    
    const [first_name, setFirstName] = useState('')
    const [last_name, setLastName] = useState('')
    const [phone_number, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [is_loading, setLoading] = useState(false)
    const [is_booking_success, setBookingSuccess] = useState(null)
    
    const [passengerFields , setPassengerFields] = useState(selectedFlight == undefined ? [] : selectedFlight.travelers.map((traveler) => {
        return {
            TravelerRefNumber:traveler.id,
            BirthDate:"1991-06-16",
            PassengerTypeCode:traveler.type,
            CountryCode:"MA",
            Gender:"MALE",
            NamePrefix:"MR",
            FirstName:"",
            LastName:"",
            Contact:{
                Email:"aissa.root@gmail.com",
                Phones:
                    {
                        deviceType:"MOBILE",
                        countryCallingCode:"212",
                        number:""
                    },
                
            },
            Documents:[]
        }
    }));

    const handleChange = (id, field, value) => {
        setPassengerFields(passengerFields.map((e) => {
            if(e.TravelerRefNumber == id){
                if(field == "Contact.Email"){
                    return {...e,Contact:{...e.Contact,Email:value}}
                }
                if(field == "Contact.Phone"){
                    return {
                            ...e,
                            Contact:{
                                ...e.Contact,
                                Phones:{
                                    ...e.Contact.Phones, 
                                    number:value
                                }
                            }
                        }
                }
                return {...e,[field]:value}
            }
            return e
        }) )
    };

    const book = () => {
        setLoading(true) 
            getPriceApi({sequence_number:[sequence_number]}).then(() => {
                bookApi({
                    sequence_number:[sequence_number],
                    travelers:passengerFields,
                    contacts:{
                        firstName:first_name,
                        lastName:last_name,
                        email:email,
                        phone:{
                            deviceType: "MOBILE",
                            countryCallingCode:"212",
                            number:phone_number
                        }
                    }
                }).then((reponse) => {
                    setLoading(false)
                    setBookingSuccess(true)
                }).catch(() => {
                    setLoading(false)
                    setBookingSuccess(false)
                })
            }).catch(() => {
                setLoading(false)
                setBookingSuccess(false)
            })
       
        
    }

    return (
        <>
            {selectedFlight == undefined ? <NotFound /> : (
                <div className="bg-white">
                    <div
                        className="fixed left-0 top-0 hidden h-full w-1/2 bg-white lg:block"
                        aria-hidden="true"
                    />
                    <div
                        className="fixed right-0 top-0 hidden h-full w-1/2 bg-indigo-900 lg:block"
                        aria-hidden="true"
                    />
        
                    <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
                        <h1 className="sr-only">Checkout</h1>
        
                        <section
                            aria-labelledby="summary-heading"
                            className="bg-indigo-900 py-12 text-indigo-300 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pb-24 lg:pt-0"
                        >
                            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                                <h2 id="summary-heading" className="sr-only">
                                    Order summary
                                </h2>
        
                                <dl>
                                    <dt className="text-sm font-medium">Amount due</dt>
                                    <dd className="mt-1 text-3xl font-bold tracking-tight text-white">
                                    {selectedFlight.pricingInfo.total} {selectedFlight.currency}
                                    </dd>
                                </dl>
        
                                <div
                                    role="list"
                                    className="divide-y divide-white divide-opacity-10 my-5 text-sm font-medium"
                                >
                                    {
                                        selectedFlight.options.map((option) => {
                                            return (
                                                <div class="shadow p-2 rounded-md mb-4" style={{backgroundColor:'#c8c6ffe6'}}>
                                                    <FlightComponent 
                                                        flight={
                                                            {
                                                                departureDateTime:option.segments[0].departureDateTime,
                                                                arrivalDateTime:option.segments.at(-1).arrivalDateTime,
                                                                flightNumber:option.segments[0].flightNumber,
                                                                departureAirport:option.segments[0].departureAirport,
                                                                departureAirportCity:option.segments[0].departureAirportCity,
                                                                arrivalAirport:option.segments.at(-1).arrivalAirport,
                                                                arrivalAirportCity:option.segments.at(-1).arrivalAirportCity,
                                                                operatingAirline:option.segments[0].operatingAirline,
                                                                operationAirlineName:option.segments[0].operationAirlineName,
                                                                cabin:option.segments[0].cabin,
                                                            }
                                                        }
                                                    />
                                                </div>
                                            )
                                        })
                                    }
        
        
                                </div>
        
                                <dl className="space-y-6 border-t border-white border-opacity-10 pt-6 text-sm font-medium">
                                    <div className="flex items-center justify-between">
                                        <dt>Base Fare</dt>
                                        <dd>{selectedFlight.pricingInfo.base} {selectedFlight.currency}</dd>
                                    </div>
        
                                    <div className="flex items-center justify-between">
                                        <dt>Taxes</dt>
                                        <dd>{selectedFlight.pricingInfo.total - selectedFlight.pricingInfo.base} {selectedFlight.currency}</dd>
                                    </div>
        
                                    <div className="flex items-center justify-between">
                                        <dt>Fees</dt>
                                        <dd>0.00 {selectedFlight.currency}</dd>
                                    </div>
        
                                    <div className="flex items-center justify-between border-t border-white border-opacity-10 pt-6 text-white">
                                        <dt className="text-base">Total</dt>
                                        <dd className="text-base">{selectedFlight.pricingInfo.total} {selectedFlight.currency}</dd>
                                    </div>
                                </dl>
        
                                <Transition
                                        as={Fragment}
                                        show={is_booking_success == true}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                    <div className="rounded-md bg-green-50 p-4 mt-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                            <h3 className="text-sm font-medium text-green-800">Booking completed</h3>
                                            <div className="mt-2 text-sm text-green-700">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.</p>
                                            </div>
                                            <div className="mt-4">
                                                <div className="-mx-2 -my-1.5 flex">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                                >
                                                    View status
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                                                >
                                                    Dismiss
                                                </button>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
        
                                <Transition
                                        as={Fragment}
                                        show={is_booking_success == false}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                    <div className="rounded-md bg-red-50 p-4 mt-6">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                            <CheckCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                            </div>
                                            <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Booking completed</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam.</p>
                                            </div>
                                            <div className="mt-4">
                                                <div className="-mx-2 -my-1.5 flex">
                                                <button
                                                    type="button"
                                                    className="rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                                >
                                                    View status
                                                </button>
                                                <button
                                                    type="button"
                                                    className="ml-3 rounded-md bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                                                >
                                                    Dismiss
                                                </button>
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
        
                            </div>
                        </section>
        
                        <section
                            aria-labelledby="payment-and-shipping-heading"
                            className="py-16 lg:col-start-1 lg:row-start-1 relative lg:mx-auto lg:w-full lg:max-w-lg lg:pb-24 lg:pt-0"
                        >
                            <div className="bg-white hidden lg:block xl:block   lg:col-start-1 lg:row-start-1  lg:mx-auto lg:w-full lg:max-w-lg mb-4">
                                <Steps />
                            </div>
        
                            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
                                <div>
                                    <h3
                                        id="contact-info-heading"
                                        className="text-lg font-medium text-gray-900"
                                    >
                                        Contact information
                                    </h3>
    
                                    <div className="flex items-center gap-2 mt-6">
                                        <div className="w-1/2">
                                            <label
                                                htmlFor="email-address"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                First Name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    id="first-name"
                                                    name="first-name"
                                                    value={first_name}
                                                    onChange={(e) => setFirstName(e.target.value)}
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div className="w-1/2">
                                            <label
                                                htmlFor="last_name"
                                                className="block text-sm font-medium text-gray-700"
                                            >
                                                Last Name
                                            </label>
                                            <div className="mt-1">
                                                <input
                                                    type="text"
                                                    id="last_name"
                                                    value={last_name}
                                                    onChange={(e) => setLastName(e.target.value)}
                                                    autoComplete="last_name"
                                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-1">
                                        <label
                                            htmlFor="email-address"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Email address
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="email"
                                                id="email-address"
                                                name="email-address"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                autoComplete="email"
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
    
                                    <div className="mt-1">
                                        <label
                                            htmlFor="phone-number"
                                            className="block text-sm font-medium text-gray-700"
                                        >
                                            Phone Number
                                        </label>
                                        <div className="mt-1">
                                            <input
                                                type="tel"
                                                id="phone-number"
                                                name="phone-number"
                                                autoComplete="phone"
                                                value={phone_number}
                                                onChange={(e) => setPhoneNumber(e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
    
                                {
                                    passengerFields.map((traveler) => {
                                        return (
                                            <>
                                                <div className="mt-10">
                                                    <h3 className="text-lg font-medium text-gray-900">
                                                        Passenger Ticket  ({traveler.PassengerTypeCode})
                                                    </h3>
    
                                                    <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                                                        <div className="col-span-3 sm:col-span-4">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-1/2">
                                                                    <label
                                                                        htmlFor="email-address"
                                                                        className="block text-sm font-medium text-gray-700"
                                                                    >
                                                                        First Name
                                                                    </label>
                                                                    <div className="mt-1">
                                                                        <input
                                                                            type="text"
                                                                            id="first-name"
                                                                            name="first-name"
                                                                            value={traveler.FirstName}
                                                                            onChange={(e) => handleChange(traveler.TravelerRefNumber,'FirstName',e.target.value)}
                                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="w-1/2">
                                                                    <label
                                                                        htmlFor="email-address"
                                                                        className="block text-sm font-medium text-gray-700"
                                                                    >
                                                                        Last Name
                                                                    </label>
                                                                    <div className="mt-1">
                                                                        <input
                                                                            type="text"
                                                                            id="last-name"
                                                                            autoComplete="last-name"
                                                                            value={traveler.LastName}
                                                                            onChange={(e) => handleChange(traveler.TravelerRefNumber,'LastName',e.target.value)}
                                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
    
                                                        <div className="col-span-3 sm:col-span-4">
                                                            <div>
                                                                <label
                                                                    htmlFor="email-address"
                                                                    className="block text-sm font-medium text-gray-700"
                                                                >
                                                                    Email address
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="email"
                                                                        id="email-address"
                                                                        name="email-address"
                                                                        autoComplete="email"
                                                                        value={traveler.Contact.Email}
                                                                        onChange={(e) => handleChange(traveler.TravelerRefNumber,'Contact.Email',e.target.value)}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
    
                                                            <div className="mt-3">
                                                                <label
                                                                    htmlFor="email-address"
                                                                    className="block text-sm font-medium text-gray-700"
                                                                >
                                                                    Phone Number
                                                                </label>
                                                                <div className="mt-1">
                                                                    <input
                                                                        type="tel"
                                                                        id="phone-number"
                                                                        name="phone-number"
                                                                        autoComplete="phone"
                                                                        value={traveler.Contact.Phones.number}
                                                                        onChange={(e) => handleChange(traveler.TravelerRefNumber,'Contact.Phone',e.target.value)}
                                                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                                                    />
                                                                </div>
                                                            </div>
    
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })
                                }
                                
    
    
                                <div className="mt-10">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Billing information
                                    </h3>
    
                                    <div className="mt-6 flex items-center">
                                        <input
                                            id="same-as-shipping"
                                            name="same-as-shipping"
                                            type="checkbox"
                                            defaultChecked
                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <div className="ml-2">
                                            <label
                                                htmlFor="same-as-shipping"
                                                className="text-sm font-medium text-gray-900"
                                            >
                                                Same as shipping information
                                            </label>
                                        </div>
                                    </div>
                                </div>
    
                                <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                                    <button
                                        type="submit"
                                        className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
                                        onClick={book}
                                    >
                                        {
                                            !is_loading ?  (<span>Book now</span>) : (<span className='animate-spin flex items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span>)
                                        }    
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
};

export default Booking;
