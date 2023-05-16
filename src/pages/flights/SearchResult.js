import { Fragment, useState } from "react";
import { Dialog, Disclosure, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ExclamationTriangleIcon, ChevronDownIcon, MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/20/solid";
import { useSelector } from 'react-redux';
import FlightComponent from "../../components/Flights/FlightComponent";
import FlightModelComponent from "../../components/Flights/FlightModelComponent"
import SearchFlightForm from "../../components/Flights/SearchFlight";
import { useNavigate } from 'react-router-dom';

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

const SearchResult = () => {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const flights   = useSelector(state => state.flights)
    const params    = useSelector(state => state.params)
    const  navigate = useNavigate();

     
    let   airlines   = []

    const stops = [
        {
            value:0,
            name:'no stop',
            count:flights.filter(flight => flight.options.every((option) => option.segments.length -1 == 0)).length
        },
        {
            value:1,
            name:'one stop',
            count:flights.filter(flight => flight.options.every((option) => option.segments.length -1 == 1)).length
        }
    ]

    flights.forEach(flight => {
        flight.options.forEach((option) => {
            if(airlines.find((a) => a.airlineCode == option.segments[0].operatingAirline ) != undefined){
                airlines.find((a) => a.airlineCode == option.segments[0].operatingAirline ).count += 1;
            }else{
                airlines.push({
                    airlineCode:option.segments[0].operatingAirline,
                    name:option.segments[0].operationAirlineName,
                    count:1
                })
            }
        })
    });


    const  [selected_airlines, updateSelectedAirlines] = useState([])
    const  [selected_stops, updateSelectedStops] = useState([])
    const  [selected_depart_time, updateDepartTime] = useState(null)
    const  [selected_return_time, updateReturnTime] = useState(null)
    const  [openFlightModel, setOpenFlightModel] = useState(false);
    const  [selected_flight,updateSelectedFlight] = useState(null)


    const handleUpdateSelectedAirlines = airline => {
        if (selected_airlines.includes(airline)){
            updateSelectedAirlines(selected_airlines.filter((e) => e !== airline))
        } else {
            updateSelectedAirlines([...selected_airlines,airline])
        }
    }

    const handleUpdateSelectedStop = stop => {
        if (selected_stops.includes(stop)){
            updateSelectedStops(selected_stops.filter((e) => e !== stop))
        } else {
            updateSelectedStops([...selected_stops,stop])
        }
    }

    const filterDate = (dateTime,time) => {
        dateTime = new Date(dateTime);

        if(time == null){ 
            return true
        }

        return true;
    }

    const filteredFlights = flights.filter((flight) => {
        return flight.options.every((option) => {
            return (selected_stops.length == 0 || selected_stops.includes(option.segments.length -1)) &&
                filterDate(option.segments[0].departureDateTime,selected_depart_time) &&
                filterDate(option.segments[option.segments.length -1].arrivalDateTime,selected_return_time) &&
                (selected_airlines.length == 0 || selected_airlines.includes(option.segments[0].marketingAirline))
            }) 
    }) 

    const book = (sequenceNumber) => {
        navigate(`/booking/${sequenceNumber}`);
    }
    

    return (
        <div className="bg-gray-50">
            <div>
                <Transition.Root show={mobileFiltersOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setMobileFiltersOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Filters
                                        </h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() =>
                                                setMobileFiltersOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close menu
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>

                                    {/* Filters */}
                                    <form className="mt-4">
                                        <Disclosure
                                            as="div"
                                            className="border-t border-gray-200 pb-4 pt-4"
                                        >
                                            {({ open }) => (
                                                <fieldset>
                                                    <legend className="w-full px-2">
                                                        <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Airlines
                                                            </span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(
                                                                        open
                                                                            ? "-rotate-180"
                                                                            : "rotate-0",
                                                                        "h-5 w-5 transform"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </legend>
                                                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                                                        <div className="space-y-6">
                                                            {
                                                                airlines.map((airline) => {
                                                                    return (
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                id={`airlines-${airline.airlineCode}`}
                                                                                name={`airlines[]`}
                                                                                defaultValue={airline.airlineCode}
                                                                                type="checkbox"
                                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                            <label
                                                                                htmlFor={`airlines-${airline.airlineCode}`}
                                                                                className="ml-3 text-sm text-gray-600 flex gap-2 items-center"
                                                                            > 
                                                                                <img src={`https://api.backend.elsahariano.com/assets/images/airlines_logos/`+airline.airlineCode+`.svg`} className="rounded-md w-9"  />
                                                                                {airline.name} ({airline.count})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>

                                        <Disclosure
                                            as="div"
                                            className="border-t border-gray-200 pb-4 pt-4"
                                        >
                                            {({ open }) => (
                                                <fieldset>
                                                    <legend className="w-full px-2">
                                                        <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Number of stops
                                                            </span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(
                                                                        open
                                                                            ? "-rotate-180"
                                                                            : "rotate-0",
                                                                        "h-5 w-5 transform"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </legend>
                                                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                                                        <div className="space-y-6">
                                                            {
                                                                stops.map((stop) => {
                                                                    return (
                                                                        <div className="flex items-center">
                                                                            <input
                                                                                id={`stops-${stop.value}`}
                                                                                type="checkbox"
                                                                                value={stop.value}
                                                                                onChange={(e) => handleUpdateSelectedStop(e.target.value)}
                                                                                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                            />
                                                                            <label
                                                                                htmlFor={`stops-${stop.value}`}
                                                                                className="ml-3 text-sm text-gray-600"
                                                                            >
                                                                                {stop.name} ({stop.count})
                                                                            </label>
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>

                                        <Disclosure
                                            as="div"
                                            className="border-t border-gray-200 pb-4 pt-4"
                                        >
                                            {({ open }) => (
                                                <fieldset>
                                                    <legend className="w-full px-2">
                                                        <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Departure Time
                                                            </span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(
                                                                        open
                                                                            ? "-rotate-180"
                                                                            : "rotate-0",
                                                                        "h-5 w-5 transform"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </legend>
                                                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                                                        <div className="space-y-3 pt-6 w-full">
                                                            <div className="flex items-center gap-2 w-full">
                                                                <div className={classNames(
                                                                        selected_depart_time == "EarlyMorning"
                                                                            ? "bg-blue-100"
                                                                            : "bg-white",
                                                                        "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                                    )}
                                                                    onClick={(e) => updateDepartTime("EarlyMorning")}>
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 4V1h-2v3h2z"></path>
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 100-8 4 4 0 000 8z"
                                                                                    clip-rule="evenodd"
                                                                                ></path>
                                                                                <path d="M20 11h3v2h-3v-2zM4 11H1v2h3v-2zm9 9v3h-2v-3h2zm-5.95-1.64L4.93 20.5 3.5 19.07l2.13-2.12 1.4 1.41zM18.36 7.05l2.12-2.12-1.41-1.42-2.12 2.13 1.41 1.41zm-1.41 11.31l2.12 2.13 1.42-1.42-2.13-2.12-1.4 1.41zM5.64 7.05L3.52 4.93 4.93 3.5l2.12 2.13-1.41 1.41z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Early
                                                                        Morning
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (5:00am
                                                                        -
                                                                        11:59am)
                                                                    </span>
                                                                </div>

                                                                <div className={classNames(
                                                                        selected_depart_time == "Morning"
                                                                            ? "bg-blue-100"
                                                                            : "bg-white",
                                                                        "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                                    )}
                                                                    onClick={(e) => updateDepartTime("Morning")}>
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41z"></path>
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    d="M18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14zm-6 4a4 4 0 100-8 4 4 0 000 8z"
                                                                                    clip-rule="evenodd"
                                                                                ></path>
                                                                                <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Morning
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (12:00am
                                                                        -
                                                                        4:59am)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <div className={classNames(
                                                                        selected_depart_time == "Afternoon"
                                                                            ? "bg-blue-100"
                                                                            : "bg-white",
                                                                        "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                                    )}
                                                                    onClick={(e) => updateDepartTime("Afternoon")}>
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41zM18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14z"></path>
                                                                                <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Afternoon
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (12:00pm
                                                                        -
                                                                        17:59pm)
                                                                    </span>
                                                                </div>

                                                                <div className={classNames(
                                                                        selected_depart_time == "Evening"
                                                                            ? " bg-blue-100"
                                                                            : "bg-white",
                                                                        "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                                    )}
                                                                    onClick={(e) => updateDepartTime("Evening")}>
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M14.01 2l1.49 1.49-1.49 1.49-1.49-1.5L14.02 2zM22 14.68A9.42 9.42 0 019.31 2 10.21 10.21 0 1022 14.68z"></path>
                                                                                <path d="M18.52 6.05l1.12 1.86 1.86 1.11-1.86 1.12L18.52 12l-1.11-1.86-1.86-1.12 1.86-1.11 1.11-1.86z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Evening
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (18:00pm
                                                                        -
                                                                        23:59pm)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>

                                        <Disclosure
                                            as="div"
                                            className="border-t border-gray-200 pb-4 pt-4"
                                        >
                                            {({ open }) => (
                                                <fieldset>
                                                    <legend className="w-full px-2">
                                                        <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                                                            <span className="text-sm font-medium text-gray-900">
                                                                Return Time
                                                            </span>
                                                            <span className="ml-6 flex h-7 items-center">
                                                                <ChevronDownIcon
                                                                    className={classNames(
                                                                        open
                                                                            ? "-rotate-180"
                                                                            : "rotate-0",
                                                                        "h-5 w-5 transform"
                                                                    )}
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        </Disclosure.Button>
                                                    </legend>
                                                    <Disclosure.Panel className="px-4 pb-2 pt-4">
                                                        <div className="space-y-3 pt-6 w-full">
                                                            <div className="flex items-center gap-2 w-full">
                                                                <div className="text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50">
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 4V1h-2v3h2z"></path>
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 100-8 4 4 0 000 8z"
                                                                                    clip-rule="evenodd"
                                                                                ></path>
                                                                                <path d="M20 11h3v2h-3v-2zM4 11H1v2h3v-2zm9 9v3h-2v-3h2zm-5.95-1.64L4.93 20.5 3.5 19.07l2.13-2.12 1.4 1.41zM18.36 7.05l2.12-2.12-1.41-1.42-2.12 2.13 1.41 1.41zm-1.41 11.31l2.12 2.13 1.42-1.42-2.13-2.12-1.4 1.41zM5.64 7.05L3.52 4.93 4.93 3.5l2.12 2.13-1.41 1.41z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Early
                                                                        Morning
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (5:00am
                                                                        -
                                                                        11:59am)
                                                                    </span>
                                                                </div>

                                                                <div className="text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50">
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41z"></path>
                                                                                <path
                                                                                    fill-rule="evenodd"
                                                                                    d="M18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14zm-6 4a4 4 0 100-8 4 4 0 000 8z"
                                                                                    clip-rule="evenodd"
                                                                                ></path>
                                                                                <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Morning
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (12:00am
                                                                        -
                                                                        4:59am)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <div className="text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50">
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41zM18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14z"></path>
                                                                                <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Afternoon
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (12:00pm
                                                                        -
                                                                        17:59pm)
                                                                    </span>
                                                                </div>

                                                                <div className="text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50">
                                                                    <div className="flex items-center justify-center">
                                                                        <svg
                                                                            width="24"
                                                                            height="24"
                                                                            aria-hidden="true"
                                                                            viewBox="0 0 24 24"
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                        >
                                                                            <svg>
                                                                                <path d="M14.01 2l1.49 1.49-1.49 1.49-1.49-1.5L14.02 2zM22 14.68A9.42 9.42 0 019.31 2 10.21 10.21 0 1022 14.68z"></path>
                                                                                <path d="M18.52 6.05l1.12 1.86 1.86 1.11-1.86 1.12L18.52 12l-1.11-1.86-1.86-1.12 1.86-1.11 1.11-1.86z"></path>
                                                                            </svg>
                                                                        </svg>
                                                                    </div>
                                                                    <h6 className="font-semibold text-sm text-gray-900">
                                                                        Evening
                                                                    </h6>
                                                                    <span className="text-xs text-gray-500">
                                                                        (18:00pm
                                                                        -
                                                                        23:59pm)
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Disclosure.Panel>
                                                </fieldset>
                                            )}
                                        </Disclosure>
                                    </form>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <Transition.Root show={mobileSearchOpen} as={Fragment}>
                    <Dialog
                        as="div"
                        className="relative z-40 lg:hidden"
                        onClose={setMobileSearchOpen}
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-25" />
                        </Transition.Child>

                        <div className="fixed inset-0 z-40 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
                                    <div className="flex items-center justify-between px-4">
                                        <h2 className="text-lg font-medium text-gray-900">
                                            Re-Search
                                        </h2>
                                        <button
                                            type="button"
                                            className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                                            onClick={() =>
                                                setMobileSearchOpen(false)
                                            }
                                        >
                                            <span className="sr-only">
                                                Close menu
                                            </span>
                                            <XMarkIcon
                                                className="h-6 w-6"
                                                aria-hidden="true"
                                            />
                                        </button>
                                    </div>
                                    <div>
                                        <SearchFlightForm  
                                            originLocationCode={params.flights[0].originLocationCode}
                                            destinationLocationCode={params.flights[0].destinationLocationCode}
                                            departureDate={new Date(params.flights[0].departureDate)}
                                            returnDate={params.flights.length > 1 ? new Date(params.flights[1].departureDate) : new Date()}
                                            type={params.type}
                                            cabin={params.flights[0].cabin}
                                            qte_adults={params.qte_adults}
                                            qte_children={params.qte_children}
                                            qte_infants={params.qte_infants}
                                        />
                                    </div>

                                    
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
                    <div className="border-b border-gray-200 pb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
                            Search Flight Results
                        </h1>
                        <p className="mt-4 text-base text-gray-500">
                            Checkout out the latest release of Basic Tees, new
                            and improved with four openings!
                        </p>
                    </div>

                    <div className="pt-12 lg:grid lg:grid-cols-3 lg:gap-x-8 xl:grid-cols-4 relative">
                        <aside className=" relative lg:sticky xl:sticky top-1">
                            <h2 className="sr-only">Filters</h2>

                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    className="inline-flex items-center lg:hidden gap-1"
                                    onClick={() => setMobileFiltersOpen(true)}
                                >
                                    <FunnelIcon
                                        className="ml-1 h-4 w-4 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Filters
                                    </span>
                                    
                                </button>

                                <button
                                    type="button"
                                    className="inline-flex items-center lg:hidden gap-1"
                                    onClick={() => setMobileSearchOpen(true)}
                                >
                                    <MagnifyingGlassIcon
                                        className="ml-1 h-4 w-4 flex-shrink-0 text-gray-400"
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm font-medium text-gray-700">
                                        Re-search
                                    </span>
                                    
                                </button>
                            </div>

                            <div className="hidden lg:block">
                                <form className="space-y-10 divide-y divide-gray-200">
                                    <div>
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-gray-900">
                                                Airlines
                                            </legend>
                                            <div className="space-y-3 pt-6">
                                                {
                                                    airlines.map((airline) => {
                                                        return (
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={`airlines-${airline.airlineCode}`}
                                                                    value={airline.airlineCode}
                                                                    onChange={(e) => handleUpdateSelectedAirlines(e.target.value)}
                                                                    type="checkbox"
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`airlines-${airline.airlineCode}`}
                                                                    className="ml-3 text-sm text-gray-600 flex gap-2 items-center"
                                                                > 
                                                                    <img src={`https://api.backend.elsahariano.com/assets/images/airlines_logos/`+airline.airlineCode+`.svg`} className="rounded-md w-9"  />
                                                                    {airline.name} ({airline.count})
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="pt-6">
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-gray-900">
                                                Number of stops
                                            </legend>
                                            <div className="space-y-3 pt-6">
                                                {
                                                    stops.map((stop) => {
                                                        return (
                                                            <div className="flex items-center">
                                                                <input
                                                                    id={`stops-${stop.value}`}
                                                                    type="checkbox"
                                                                    value={stop.value}
                                                                    onChange={(e) => handleUpdateSelectedStop(e.target.value)}
                                                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                                />
                                                                <label
                                                                    htmlFor={`stops-${stop.value}`}
                                                                    className="ml-3 text-sm text-gray-600"
                                                                >
                                                                    {stop.name} ({stop.count})
                                                                </label>
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="pt-6">
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-gray-900">
                                                Departure Time
                                            </legend>
                                            <div className="space-y-3 pt-6 w-full">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={classNames(
                                                            selected_depart_time == "EarlyMorning"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateDepartTime("EarlyMorning")}
                                                    >
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 4V1h-2v3h2z"></path>
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 100-8 4 4 0 000 8z"
                                                                        clip-rule="evenodd"
                                                                    ></path>
                                                                    <path d="M20 11h3v2h-3v-2zM4 11H1v2h3v-2zm9 9v3h-2v-3h2zm-5.95-1.64L4.93 20.5 3.5 19.07l2.13-2.12 1.4 1.41zM18.36 7.05l2.12-2.12-1.41-1.42-2.12 2.13 1.41 1.41zm-1.41 11.31l2.12 2.13 1.42-1.42-2.13-2.12-1.4 1.41zM5.64 7.05L3.52 4.93 4.93 3.5l2.12 2.13-1.41 1.41z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Early Morning
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (5:00am - 11:59am)
                                                        </span>
                                                    </div>

                                                    <div className={classNames(
                                                            selected_depart_time == "Morning"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateDepartTime("Morning")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41z"></path>
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14zm-6 4a4 4 0 100-8 4 4 0 000 8z"
                                                                        clip-rule="evenodd"
                                                                    ></path>
                                                                    <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Morning
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (12:00am - 4:59am)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={classNames(
                                                            selected_depart_time == "Afternoon"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateDepartTime("Afternoon")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41zM18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14z"></path>
                                                                    <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Afternoon
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (12:00pm - 17:59pm)
                                                        </span>
                                                    </div>

                                                    <div className={classNames(
                                                            selected_depart_time == "Evening"
                                                                ? " bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateDepartTime("Evening")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M14.01 2l1.49 1.49-1.49 1.49-1.49-1.5L14.02 2zM22 14.68A9.42 9.42 0 019.31 2 10.21 10.21 0 1022 14.68z"></path>
                                                                    <path d="M18.52 6.05l1.12 1.86 1.86 1.11-1.86 1.12L18.52 12l-1.11-1.86-1.86-1.12 1.86-1.11 1.11-1.86z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Evening
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (18:00pm - 23:59pm)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>

                                    <div className="pt-6">
                                        <fieldset>
                                            <legend className="block text-sm font-medium text-gray-900">
                                                Return Time
                                            </legend>
                                            <div className="space-y-3 pt-6 w-full">
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={classNames(
                                                            selected_return_time == "EarlyMorning"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateReturnTime("EarlyMorning")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 4V1h-2v3h2z"></path>
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M12 18a6 6 0 100-12 6 6 0 000 12zm0-2a4 4 0 100-8 4 4 0 000 8z"
                                                                        clip-rule="evenodd"
                                                                    ></path>
                                                                    <path d="M20 11h3v2h-3v-2zM4 11H1v2h3v-2zm9 9v3h-2v-3h2zm-5.95-1.64L4.93 20.5 3.5 19.07l2.13-2.12 1.4 1.41zM18.36 7.05l2.12-2.12-1.41-1.42-2.12 2.13 1.41 1.41zm-1.41 11.31l2.12 2.13 1.42-1.42-2.13-2.12-1.4 1.41zM5.64 7.05L3.52 4.93 4.93 3.5l2.12 2.13-1.41 1.41z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Early Morning
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (5:00am - 11:59am)
                                                        </span>
                                                    </div>

                                                    <div className={classNames(
                                                            selected_return_time == "Morning"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateReturnTime("Morning")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41z"></path>
                                                                    <path
                                                                        fill-rule="evenodd"
                                                                        d="M18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14zm-6 4a4 4 0 100-8 4 4 0 000 8z"
                                                                        clip-rule="evenodd"
                                                                    ></path>
                                                                    <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Morning
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (12:00am - 4:59am)
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 w-full">
                                                    <div className={classNames(
                                                            selected_return_time == "Afternoon"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateReturnTime("Afternoon")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M13 3h-2v3h2V3zM7.05 7.64L4.93 5.5 3.52 6.93l2.12 2.12 1.41-1.41zM18 14c0 1.54-.58 2.94-1.53 4H23v2H1v-2h6.53A6 6 0 1118 14z"></path>
                                                                    <path d="M23 13h-3v2h3v-2zM1 13h3v2H1v-2zm18.07-7.49l-2.12 2.13 1.41 1.41 2.12-2.12-1.41-1.42z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Afternoon
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (12:00pm - 17:59pm)
                                                        </span>
                                                    </div>

                                                    <div className={classNames(
                                                            selected_return_time == "Evening"
                                                                ? "bg-blue-100"
                                                                : "bg-white",
                                                            "text-center border border-gray-300 p-2 rounded-lg w-1/2 cursor-pointer hover:bg-gray-50"
                                                        )}
                                                        onClick={(e) => updateReturnTime("Evening")}>
                                                        <div className="flex items-center justify-center">
                                                            <svg
                                                                width="24"
                                                                height="24"
                                                                aria-hidden="true"
                                                                viewBox="0 0 24 24"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                            >
                                                                <svg>
                                                                    <path d="M14.01 2l1.49 1.49-1.49 1.49-1.49-1.5L14.02 2zM22 14.68A9.42 9.42 0 019.31 2 10.21 10.21 0 1022 14.68z"></path>
                                                                    <path d="M18.52 6.05l1.12 1.86 1.86 1.11-1.86 1.12L18.52 12l-1.11-1.86-1.86-1.12 1.86-1.11 1.11-1.86z"></path>
                                                                </svg>
                                                            </svg>
                                                        </div>
                                                        <h6 className="font-semibold text-sm text-gray-900">
                                                            Evening
                                                        </h6>
                                                        <span className="text-xs text-gray-500">
                                                            (18:00pm - 23:59pm)
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </form>
                            </div>
                        </aside>

                        <div className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3">
                            <div className="mb-2 hidden lg:block">
                                <SearchFlightForm  
                                    originLocationCode={params.flights[0].originLocationCode}
                                    destinationLocationCode={params.flights[0].destinationLocationCode}
                                    departureDate={new Date(params.flights[0].departureDate)}
                                    returnDate={params.flights.length > 1 ? new Date(params.flights[1].departureDate) : new Date()}
                                    type={params.type}
                                    cabin={params.flights[0].cabin}
                                    qte_adults={params.qte_adults}
                                    qte_children={params.qte_children}
                                    qte_infants={params.qte_infants}
                                />
                            </div>
                            <div>
                                <h1 className="font-semibold text-2xl text-blue-700 py-6">Flight List</h1>
                                {
                                    filteredFlights.length > 0 ? 
                                        filteredFlights.map((flight) => {
                                            return (
                                                <>
                                                    <div className="bg-white p-3 rounded shadow border border-gray-50 grid lg:flex xl:flex gap-2 items-center mb-2">
                                                        <div className="w-full lg:w-5/6 xl:w-5/6">
                                                            {
                                                                flight.options.map((option) => {
                                                                    return (
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
                                                                    )
                                                                })
                                                            }
                                                            
                                                        </div>
                                                        <div className="w-full lg:w-1/6 xl:w-1/6 flex items-center justify-center">
                                                            <div className="text-center flex lg:block xl:block gap-2 items-center justify-between w-full">
                                                                <div className="text-center font-bold text-blue-600">
                                                                    <span className="text-md xl:text-2xl lg:text-2xl ml-1">{flight.price}</span>
                                                                    <span className="text-sm">{flight.currency}</span>
                                                                </div>
                                                                <button className="bg-blue-600 text-white shadow-sm text-xs xl:text-sm lg:text-sm font-semibold p-2 rounded-md my-1" onClick={() => book(flight.sequenceNumber)}>Book Flight</button>
                                                                <button className="text-gray-500 text-xs" onClick={() => updateSelectedFlight(flight) || setOpenFlightModel(true)}>Flight Details</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </>
                                            )
                                        })
                                    : (<>
                                        <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-sm text-yellow-700">
                                                        There are no results mush you search
                                                    </p>
                                                </div>
                                            </div>
                                            </div>
                                        
                                    </>)
                                }
                            </div>
                        </div>
                        
                        {
                            selected_flight !== null ? (<FlightModelComponent open={openFlightModel}  setOpen={setOpenFlightModel} flight={selected_flight} /> ) : (<></>)
                        }
                        
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SearchResult;
