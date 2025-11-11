const LocationMap = () => {
    return (
        <div className="w-full h-full min-h-[225px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px] rounded-xl overflow-hidden shadow-bold_r_md border-2 border-dark">
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2499.8!2d3.2285003!3d51.2011098!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c350a695a036ab%3A0xe1bdf880f1975d5f!2sRodenonnenstraat%2021%2C%208000%20Brugge!5e0!3m2!1snl!2sbe!4v1731357000000&z=16"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Webdevamin - Rodenonnenstraat 21, 8000 Brugge"
                className="w-full h-full min-h-[225px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px]"
            />
        </div>
    );
};

export default LocationMap;
