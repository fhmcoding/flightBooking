import { Fragment, useRef ,useState} from "react";
import { Dialog, Transition } from "@headlessui/react";
import FlightComponent from "./FlightComponent";
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { useNavigate } from 'react-router-dom';

const FlightModelComponent = (props) => {
    const cancelButtonRef = useRef(null);
    const  navigate = useNavigate();
    const [current_tap, setCurrentTap] = useState("flights")

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    const book = () => {
       navigate(`/booking/${props.flight.sequenceNumber}`);
    }

    

    return (
        <Transition.Root show={props.open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-10"
                initialFocus={cancelButtonRef}
                onClose={props.setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white  text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-3xl ">
                                <div>
                                    <div className="px-4 pb-4 pt-5 sm:p-6">
                                        <div className="sm:hidden">
                                            <select
                                                id="tabs"
                                                name="tabs"
                                                className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                                                defaultValue={current_tap}
                                                onChange={(e) => setCurrentTap(e.target.value)}
                                            >
                                                <option value={'flights'}>Flights</option>
                                                <option value={'pricing'}>Pricing</option>
                                                <option value={'baggage'}>Baggage</option>
                                            </select>
                                        </div>
                                        <div className="hidden sm:block">
                                            <nav className="flex space-x-4" aria-label="Tabs">
                                                <a 
                                                    className={classNames(
                                                        current_tap == 'flights' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                                        'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                                    )}
                                                    aria-current={current_tap == 'flights' ? 'page' : undefined}
                                                    onClick={() => setCurrentTap('flights')}
                                                >
                                                    Flight Information
                                                </a>

                                                <a 
                                                    
                                                    className={classNames(
                                                        current_tap == 'pricing' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                                        'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                                    )}
                                                    aria-current={current_tap == 'pricing' ? 'page' : undefined}
                                                    onClick={() => setCurrentTap('pricing')}
                                                >
                                                    Fare Details
                                                </a>

                                                <a 
                                                    className={classNames(
                                                        current_tap == 'baggage' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:text-gray-700',
                                                        'rounded-md px-3 py-2 text-sm font-medium cursor-pointer'
                                                    )}
                                                    aria-current={current_tap == 'baggage' ? 'page' : undefined}
                                                    onClick={() => setCurrentTap('baggage')}
                                                >
                                                    Baggage
                                                </a>
                                            </nav> 
                                        </div>
                                        <div className="my-10">
                                                {
                                                    current_tap == 'flights' ? (
                                                        <div>
                                                            {
                                                                props.flight.options.map((option) => option.segments.map((segemnt) => ( <FlightComponent flight={segemnt} />) ))
                                                            }
                                                        </div>
                                                    ) : current_tap == 'pricing' ? (
                                                        <div>
                                                            
                                                            <table className="min-w-full divide-y divide-gray-300">
                                                                <tr>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Base Fare</th> 
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{props.flight.pricingInfo.base} {props.flight.currency}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Taxes</th> 
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{props.flight.pricingInfo.total - props.flight.pricingInfo.base} {props.flight.currency}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Fees</th> 
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">0 {props.flight.currency}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th> 
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{props.flight.pricingInfo.total} {props.flight.currency}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div className="rounded-md bg-yellow-50 p-4">
                                                                <div className="flex">
                                                                    <div className="flex-shrink-0">
                                                                    <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                                                    </div>
                                                                    <div className="ml-3">
                                                                    <h3 className="text-sm font-medium text-yellow-800">Attention needed</h3>
                                                                    <div className="mt-2 text-sm text-yellow-700">
                                                                        <p>
                                                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid pariatur, ipsum similique veniam quo
                                                                        totam eius aperiam dolorum.
                                                                        </p>
                                                                    </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )     
                                                }
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                                        <button
                                            type="button"
                                            className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                                            onClick={book}
                                        >
                                            Booking
                                        </button>
                                        <button
                                            type="button"
                                            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                            onClick={() => props.setOpen(false)}
                                            ref={cancelButtonRef}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    );
};

export default FlightModelComponent;
