start:
	docker-compose pull
	docker-compose up -d

dist:
	npm run build

errors:
	docker-compose logs
	
clean:
	docker-compose kill
	docker system prune -f
