const LocationMap = () => {
    return (
        <div className="w-full h-full min-h-[225px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px] rounded-xl overflow-hidden shadow-bold_r_md border-2 border-dark">
            <iframe
                src="https://www.google.com/maps?q=Zuiderakker+18,+8310+Brugge,+Belgi%C3%AB&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Webdevamin - Zuiderakker 18, 8310 Brugge"
                className="w-full h-full min-h-[225px] sm:min-h-[380px] md:min-h-[500px] lg:min-h-[600px]"
            />
        </div>
    );
};

export default LocationMap;
