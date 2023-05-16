
import {ClockIcon } from "@heroicons/react/20/solid";

const FlightComponent = (props) => {

    const departureDateTime = new Date(props.flight.departureDateTime).toLocaleTimeString('en-GB', {hour: '2-digit',minute: '2-digit',hourCycle: 'h23'})
    const arrivalDateTime = new Date(props.flight.arrivalDateTime).toLocaleTimeString('en-GB', {hour: '2-digit',minute: '2-digit',hourCycle: 'h23'})
    

    const duration = () => {
        let arrival_date = new Date(props.flight.departureDateTime) ;
        let departure_date = new Date(props.flight.arrivalDateTime);

        let h_duree = arrival_date.getHours() - departure_date.getHours();
        let m_duree = arrival_date.getMinutes() - departure_date.getMinutes();

        if(m_duree < 0){
            m_duree += 60;
            h_duree -= 1
        }

        if(h_duree < 0){
            h_duree += 24
        }

        return `${h_duree}h ${m_duree}min`;
    }

    

    return (
        <>
            <div className="flex items-center pb-1 w-full relative">
                <div className="grid items-center gap-2 lg:flex xl:flex">
                    <div className="flex items-center justify-center">
                        <img  src={`https://api.backend.elsahariano.com/assets/images/airlines_logos/${props.flight.operatingAirline}.svg`} class="rounded-md w-8 lg:w-10 xl:w-10" />
                    </div>
                    <div className="grid lg:text-left xl:text-left text-center">
                        <span className="lg:text-sm xl:text-sm text-xs font-medium text-gray-700 lg:block xl:block hidden">{props.flight.operationAirlineName}</span>
                        <span class="text-xs text-gray-500">{props.flight.operatingAirline}{props.flight.flightNumber}  </span>
                        <span className="text-xs lowercase text-gray-400">{props.flight.cabin}</span>
                    </div>
                </div>

                <div className="text-center flight-item">
                    <span className="text-gray-800 text-xl xl:text-2xl lg:text-2xl font-bold">{departureDateTime}</span>
                    <h6><span className="text-gray-800 text-sm font-medium hidden lg:block xl:block">{props.flight.departureAirport} </span> <span className="text-sm text-gray-800">{props.flight.departureAirportCity}</span> </h6>
                    <span className="text-gray-500 text-xs font-semibold hidden lg:block xl:block">Terminal: 0</span>
                </div>

                <div className="flight-direction text-center">
                    <div className="flex items-center justify-center">
                        <div className="flex gap-1 items-center">
                            <ClockIcon
                                className="h-4 w-4 flex-shrink-0 text-gray-500"
                                aria-hidden="true"
                            />
                            <span className="text-gray-500 text-xs">{ duration() }</span>

                        </div>
                    </div>
                    <div className="line-arrow">
                        <div className="line-arrow-div"></div>
                        <svg viewBox="0 0 64 64" pointer-events="all" aria-hidden="true" className="etiIcon" role="presentation"><path d="M59.709 32L4.291 0v64z"></path></svg>
                    </div>
                </div>

                <div className="text-center flight-item">
                    <span className="text-gray-800 text-xl xl:text-2xl lg:text-2xl font-bold">{arrivalDateTime}</span>
                    <h6><span className="text-gray-800 text-sm font-medium hidden lg:block xl:block">{props.flight.arrivalAirport}</span> <span className="text-sm text-gray-800">{props.flight.arrivalAirportCity}</span> </h6>
                    <span className="text-gray-500 text-xs font-semibold  hidden lg:block xl:block">Terminal: 0</span>
                </div>
            </div>
        </>
    )
}

export default FlightComponent