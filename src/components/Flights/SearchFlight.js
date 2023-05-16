import { MapIcon, CalendarIcon, ChevronDownIcon, PlusCircleIcon, MinusCircleIcon } from '@heroicons/react/20/solid'
import React, { useState,useEffect,Fragment  } from "react";
import { useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react'

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { useSelector,useDispatch } from 'react-redux';
import { searchFlights } from '../../stores/flights/actions'

const SearchFlightForm = (props) => {
    
   
    const [departDate, setDepartDate] = useState(props.departureDate == undefined ? new Date() : props.departDate);
    const [returnDate, setreturnDate] = useState(props.returnDate == undefined ? new Date() : props.returnDate);
    
    const [originLocationCode, setLeaving] = useState(props.originLocationCode == undefined ? '' : props.originLocationCode)
    const [destinationLocationCode, setGoing] = useState(props.destinationLocationCode == undefined ? '' : props.destinationLocationCode)
    const [type,setCurrentTap] = useState(props.type == undefined ? 'one_way' : props.type)
    const [cabin,setCabin] = useState(props.cabin == undefined ? 'ALL' : props.cabin)
    const [qte_adults,setQteAdults] = useState(props.qte_adults == undefined ? 1 : props.qte_adults)
    const [qte_children,setQteChildren] = useState(props.qte_children == undefined ? 0 : props.qte_children)
    const [qte_infants,setQteInfants] = useState(props.qte_infants == undefined ? 0 : props.qte_infants)

    const  isLoading = useSelector(state => state.isLoading)
    const  flights   = useSelector(state => state.flights)
    const  navigate =  useNavigate();
    const  dispatch =  useDispatch();

    const getFlights = () => {
        let flights_params = [
            {
                originLocationCode,
                destinationLocationCode,
                cabin,
                departureDate:departDate.toISOString().split('T')[0],
                waitList: false,
                range:0
            },
        ]
        if(type == 'round_trip'){
            flights_params = [...flights_params,{
                destinationLocationCode:originLocationCode,
                originLocationCode:destinationLocationCode,
                cabin,
                departureDate:returnDate.toISOString().split('T')[0],
                waitList: false,
                range:0
            }]
        }
        return flights_params
    }

    useEffect(() => {
        if (flights.length > 0) {
            navigate('/results'); 
        }
      }, [flights, navigate]);

    const search = () => {
        dispatch(
            searchFlights(
                {
                    type,
                    flights:getFlights(),
                    qte_adults,
                    qte_children,
                    qte_infants,
                    addOneWayOffers:false
                }
            )
        )
    }

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }


    return (
        <>
            <div className="bg-white rounded-lg shadow-none lg:shadow-md xl:shadow-md p-4">
                <div className='w-full flex items-center justify-between'>
                    <div className="hidden sm:block">
                        <nav className="flex space-x-4" aria-label="Tabs">
                            <a 
                                className={classNames(
                                    type == 'one_way' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                    'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                )}
                                aria-current={type == 'one_way' ? 'page' : undefined}
                                onClick={() => setCurrentTap('one_way')}
                            >
                                One Way
                            </a>

                            <a 
                                
                                className={classNames(
                                    type == 'round_trip' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                    'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                )}
                                aria-current={type == 'round_trip' ? 'page' : undefined}
                                onClick={() => setCurrentTap('round_trip')}
                            >
                                Round Trip
                            </a>

                            <a 
                                className={classNames(
                                    type == 'multi_city' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                    'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                )}
                                aria-current={type == 'multi_city' ? 'page' : undefined}
                                onClick={() => setCurrentTap('multi_city')}
                            >
                                Multi City
                            </a>
                        </nav> 
                    </div>
                    <div className='flex justify-between items-center'>
                        <Menu as="div" className="relative inline-block text-left  lg:hidden xl:hidden">
                            <div>
                                <Menu.Button className="inline-flex  w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900  hover:bg-gray-50">
                                <span className='lowercase'>{type.replace('_',' ')}</span>
                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCurrentTap('one_way')}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            One Way
                                        </span>
                                    )}
                                    </Menu.Item>

                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCurrentTap('round_trip')}
                                            className={classNames(
                                                cabin == "ECONOMY" ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            Round Trip
                                        </span>
                                    )}
                                    </Menu.Item>

                                    
                                </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="inline-flex  w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900  hover:bg-gray-50">
                                <span className='lowercase'>{cabin.replace('_',' ')}</span>
                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 z-20 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCabin('ALL')}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            ALL
                                        </span>
                                    )}
                                    </Menu.Item>

                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCabin('ECONOMY')}
                                            className={classNames(
                                                cabin == "ECONOMY" ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            Economy
                                        </span>
                                    )}
                                    </Menu.Item>

                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCabin('PREMIUM_ECONOMY')}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            Premium economy
                                        </span>
                                    )}
                                    </Menu.Item>

                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCabin('BUSINESS')}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            Business class
                                        </span>
                                    )}
                                    </Menu.Item>

                                    <Menu.Item>
                                    {({ active }) => (
                                        <span
                                            onClick={() => setCabin('FIRST')}
                                            className={classNames(
                                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                                'block px-4 py-2 text-sm cursor-pointer'
                                            )}
                                        >
                                            First class
                                        </span>
                                    )}
                                    </Menu.Item>
                                    
                                </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                        <Menu as="div" className="relative inline-block text-left">
                            <div>
                                <Menu.Button className="inline-flex  w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-900  hover:bg-gray-50">
                                <span className='lowercase'>{qte_adults + qte_children + qte_infants  } Travelers</span>
                                <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                                </Menu.Button>
                            </div>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute left-0 z-50 mt-2 w-72 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="p-3">
                                        <h2 className='font-semibold text-gray-900'>Travelers</h2> 
                                        <div className='py-2'>
                                            <div className='flex justify-between items-center'>
                                                <div class="grid">
                                                    <span className='font-semibold text-gray-800 text-sm'>Adult</span>
                                                    <span className='text-gray-500 text-xs'>+12 Year</span>
                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <MinusCircleIcon className={classNames(qte_adults <= 1 ? 'text-gray-400' : 'text-blue-500','cursor-pointer w-8 h-8 ')} onClick={() => qte_adults == 1 ? null : setQteAdults(qte_adults - 1)} />
                                                    <span>{qte_adults}</span>
                                                    <PlusCircleIcon className='w-8 h-8  text-blue-500 cursor-pointer'  onClick={() => setQteAdults(qte_adults + 1)}  />
                                                </div>
                                            </div>

                                            <div className='flex justify-between items-center my-3'>
                                                <div class="grid">
                                                    <span className='font-semibold text-gray-800 text-sm'>Children</span>
                                                    <span className='text-gray-500 text-xs'>12 - 2 Year</span>
                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <MinusCircleIcon  className={classNames(qte_children <= 1 ? 'text-gray-400' : 'text-blue-500','cursor-pointer w-8 h-8 ')} onClick={() => qte_children == 1 ? null : setQteChildren(qte_children - 1)} />
                                                    <span>{qte_children}</span>
                                                    <PlusCircleIcon className='w-8 h-8  text-blue-500 cursor-pointer'onClick={() => setQteChildren(qte_children + 1)} />
                                                </div>
                                            </div>

                                            <div className='flex justify-between items-center'>
                                                <div class="grid">
                                                    <span className='font-semibold text-gray-800 text-sm'>Baby</span>
                                                    <span className='text-gray-500 text-xs'>unser 2 year</span>
                                                </div>
                                                <div className='flex gap-2 items-center'>
                                                    <MinusCircleIcon  className={classNames(qte_infants <= 1 ? 'text-gray-400' : 'text-blue-500','cursor-pointer w-8 h-8 ')}  onClick={() => setQteInfants(qte_infants - 1)} />
                                                    <span>{qte_infants}</span>
                                                    <PlusCircleIcon className='w-8 h-8  text-blue-500 cursor-pointer' onClick={() => setQteInfants(qte_infants + 1)} />
                                                </div>
                                            </div>
                                            
                                            <div className='mt-3'>
                                                <Menu.Item>
                                                    <button className='bg-blue-500 txet-white py-2 px-2 rounded-lg shadow  text-white w-full text-center font-semibold'>Save</button>
                                                </Menu.Item>
                                            </div>
                                            
                                        </div>       
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>

                <div className="grid gap-2 lg:fkex xl:flex">
                    <div className="relative mt-2 flight-item">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MapIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="txet"
                            name="orign"
                            id="orign"
                            value={originLocationCode}
                            onChange={(e) => setLeaving(e.target.value)}  
                            className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Leaving From"
                        />
                    </div>

                    <div className="relative mt-2 flight-item">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <MapIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="txet"
                            name="orign"
                            id="origh"
                            value={destinationLocationCode}
                            onChange={(e) => setGoing(e.target.value)}  
                            className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            placeholder="Going to"
                        />
                    </div>
                   
                    <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                            <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <DatePicker selected={departDate} 
                                    onChange={(date) => setDepartDate(date)}  
                                    className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    placeholder="depart date"
                                    minDate={new Date()}
                        />
                    </div>
                    {
                        type == "round_trip" ?
                        (
                            <div className="relative mt-2">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 z-10">
                                    <CalendarIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <DatePicker selected={returnDate} 
                                            onChange={(date) => setreturnDate(date)}  
                                            className="block w-full rounded-lg border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                            placeholder="depart date"
                                            minDate={departDate}
                                />
                            </div>
                        ):null
                    }
                    

                    <div className="flex justify-center mt-2">
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline" 
                                type="submit"
                                onClick={() => search()}>
                            {
                                !isLoading ? (<span>Search</span>) : (<span className='animate-spin flex items-center justify-center'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg></span>)
                            }
                            
                        </button>
                    </div>
                </div>
            </div>
        </>

    )
}


export default SearchFlightForm