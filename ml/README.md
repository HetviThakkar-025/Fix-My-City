cd ml
docker build -t fixmycity-ml .
docker run -p 7860:7860 fixmycity-ml
curl http://localhost:7860
